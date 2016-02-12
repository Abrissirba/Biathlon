
//sportapi
function sportapi_init(Settings) {
    
    //Default Settings
    var mSettings = {
        serviceURI: "/modules/sportapi/",
        fallbackURI: "/modules/sportapi/",
        transport: 'jsonp',
        docsURI: "http://ibu.blob.core.windows.net/",
        flagsExtensions: ".png",
        resourceURI: "http://info.blob.core.windows.net/resources/common/",
        isMediaCenter: false,
        useSignals: true
    };

    //Übergebene Settings
    if (Settings) {
        var fields = Settings.split(",");
        var i = 0;
        for (i = 0; i < fields.length; i++) {
            var p = fields[i].split(": ");
            if (p.length > 1) {
                var para = $.trim(p[0].toLowerCase());
                var value = $.trim(p[1]);
                if (para === "serviceuri" && value !== "") {
                    var mMirrors = value.split("|");
                    if (mMirrors.length > 1 && Math && Math.random ) {
                        mSettings.serviceURI = mMirrors[Math.floor((Math.random() * mMirrors.length))];
                    } else {
                        mSettings.serviceURI = mMirrors[0];
                    }
                }
                if (para === "ismediacenter") mSettings.isMediaCenter = (value === 'true');
                if (para === "docsuri" && value !== "") mSettings.docsURI = value;
                if (para === "fallbackuri" && value !== "") mSettings.fallbackURI = value;
                if (para === "transport" && value !== "") mSettings.transport = value;
                if (para === "usesignals" && value !== "") mSettings.useSignals = (value === 'true');

            }
        }
    }

    RootModel.sportapi = new sportapi_model(mSettings);

    RootModel.sportapi.Init();

}


function sportapi_model(Settings) {

    var self = this;

    this.Settings = Settings;
    if (this.Settings.traceInterval < 3000) this.Settings.traceInterval = 3000;


    this.Seasons = ko.observableArray([]);
    this.Organizers = ko.observableArray([]);
    this.FactItems = ko.observableArray([]);
    this.StatItems = ko.observableArray([]);

    this.SignalHub = NaN;

    this.CurrentSeason = ko.observable(NaN);
    this.CurrentSeason.subscribe(function (newValue) {
        if (newValue) {
            ko.utils.arrayFirst(RootModel.sportapi.Seasons(), function (m) {
                return m.IsCurrent() || false;
            }).IsCurrent(false);

            newValue.IsCurrent(true);

            //Event Schedule laden
            RootModel.sportapi.LoadSeasonEvents(newValue.SeasonId());

            //Season Cups laden
            RootModel.sportapi.LoadSeasonCups(newValue.SeasonId());
        }
    });

    this.CurrentOrganizer = ko.observable(NaN);
    this.CurrentOrganizer.subscribe(function (newValue) {
        var old = ko.utils.arrayFirst(RootModel.sportapi.Organizers(), function (m) {
            return m.IsCurrent() || false;
        });
        if (old) old.IsCurrent(false);
        newValue.IsCurrent(true);
    });

    //Cups
    this.Cups = ko.observableArray([]);

    this.CupsFilterLevel = ko.observable(1); 

    this.filteredCups = ko.computed(function () {
        var mLevel = this.CupsFilterLevel();
        var f = ko.utils.arrayFilter(this.Cups(), function (item) {
            return (item.Level() == mLevel);
        });
        return f;
    }, this);

    this.CurrentCup = ko.observable(NaN);

    this.CurrentCup.subscribe(function (newValue) {
        var old = ko.utils.arrayFirst(RootModel.sportapi.Cups(), function (m) {
            return m.IsCurrent() || false;
        });
        if (old) old.IsCurrent(false);

        newValue.IsCurrent(true);
        self.LoadCupResults();

    });

    this.CupResultRows = ko.observableArray([]);


    //SportEvents
    this.SportEvents = ko.observableArray([]);

    this.SportEventsFilterLevel = ko.observable(1);     //Calendar Level 1

    this.filteredSportEvents = ko.computed(function () {
        var mLevel = this.SportEventsFilterLevel();
        var f = ko.utils.arrayFilter(this.SportEvents(), function (item) {
            return (item.Level() == mLevel);
        });
        return f;
    }, this);

    this.CurrentSportEvent = ko.observable(NaN);

    this.CurrentSportEvent.subscribe(function (newValue) {
        var old=ko.utils.arrayFirst(RootModel.sportapi.SportEvents(), function (m) {
            return m.IsCurrent() || false;
        });
        if (old) old.IsCurrent(false);

        newValue.IsCurrent(true);

        //Competition Schedule laden
        RootModel.sportapi.LoadEventCompetitions(false);

        if (self.Settings.isMediaCenter) self.LoadMediaAssets(newValue.EventId(), "", "");
        
        if (newValue.MedalSetId()) {
            RootModel.sportapi.LoadEventMedalResults(false);
        } else {
            RootModel.sportapi.MedalResults.clear;
        }
    });


    this.MedalResults = ko.observableArray([]);


    this.Competitions = ko.observableArray([]);
    this.CurrentCompetition = ko.observable(NaN);
    this.CurrentCompetition.subscribe(function (newValue) {
        var old = ko.utils.arrayFirst(RootModel.sportapi.Competitions(), function (m) {
            return m.IsCurrent() || false;
        });
        if (old) old.IsCurrent(false);

        newValue.IsCurrent(true);

        //Competitions items laden
        RootModel.sportapi.LoadCompetitionResults();
        RootModel.sportapi.LoadCompetitionReports();

        if (self.Settings.isMediaCenter) RootModel.sportapi.LoadCompetitionFacts();

    });

    this.ResultRows = ko.observableArray([]);
    this.ResultRows_SortByStartOrder = function () {
        RootModel.sportapi.ResultRows.sort(function (v1, v2) { return v1.StartOrder() - v2.StartOrder(); })
    }
    this.ResultRows_SortByResultOrder = function () {       
        RootModel.sportapi.ResultRows.sort(function (v1, v2) { return (10*v1.ResultOrder()+(v1.Leg()||0)) - (10*v2.ResultOrder()+(v2.Leg()||0)); })
    }
    this.ResultRows_SortByNat = function () {
        if (RootModel.sportapi.CurrentCompetition().DisciplineId() == "RL" || RootModel.sportapi.CurrentCompetition().DisciplineId() == "SR") {
            RootModel.sportapi.ResultRows.sort(function (v1, v2) { return v1.Nat() == v2.Nat() ? (v1.Leg() < v2.Leg() ? -1 : 1) : (v1.Nat() < v2.Nat() ? -1 : 1); })
        } else {
            RootModel.sportapi.ResultRows.sort(function (v1, v2) { return v1.Nat() == v2.Nat() ? (v1.Name() < v2.Name() ? -1 : 1) : (v1.Nat() < v2.Nat() ? -1 : 1); })
        }
    }

    this.CurrentResultRow = ko.observable();
    this.CurrentResultRow.subscribe(function (newValue) {
        var old = ko.utils.arrayFirst(RootModel.sportapi.ResultRows(), function (m) {
            return m.IsCurrent() || false;
        });
        if (old) old.IsCurrent(false);
        newValue.IsCurrent(true);

        //Falls Analysemodul geladen
        if (RootModel.raceanalysis) {
            RootModel.sportapi.LoadAnalysis();
        }
    });

    this.CurrentCupResultRow = ko.observable();
    this.CurrentCupResultRow.subscribe(function (newValue) {
        var old = ko.utils.arrayFirst(RootModel.sportapi.CupResultRows(), function (m) {
            return m.IsCurrent() || false;
        });
        if (old) old.IsCurrent(false);
        newValue.IsCurrent(true);        
    });


    this.ReportItems = ko.observableArray([]);
    this.CurrentReportItem = ko.observable();
    this.CurrentReportItem.subscribe(function (newValue) {
        var old = ko.utils.arrayFirst(RootModel.sportapi.ReportItems(), function (m) {
            return m.IsCurrent() || false;
        });
        if (old) old.IsCurrent(false);

        newValue.IsCurrent(true);
    });


    this.Athletes = ko.observableArray([]);
    this.CurrentAthlete = ko.observable();
    this.CurrentBiosLevel = "WC";
    this.CurrentAthlete.subscribe(function (newValue) {
        self.BiosValues().clear;
        self.BiosRankings().clear;
        if (newValue) {
            self.LoadBiosValues(newValue.IBUId());
            self.LoadBiosRankings(newValue.IBUId(), "",self.CurrentBiosLevel);
            if (self.Settings.isMediaCenter) self.LoadMediaAssets("", "", newValue.IBUId());
        }
    });
    this.BiosValues = ko.observableArray([]);
    this.BiosValuesFilter = ko.observable("");
    this.filteredBiosValues = ko.computed(function () {
        var mFilter = this.BiosValuesFilter();
        var f = ko.utils.arrayFilter(this.BiosValues(), function (item) {
            return (item.Group() === mFilter);
        });
        return f;
    }, this);

    this.BiosRankings = ko.observableArray([]);


    this.Facts = ko.observableArray([]);
    this.filteredFacts = ko.computed(function () {
        var filteredValue=ko.utils.arrayFilter(this.Facts(), function (m) {
            var mCat = "";
            if (RootModel.sportapi.CurrentFactCategory()) mCat=RootModel.sportapi.CurrentFactCategory().Category();
            return (m.FactItem().Category() === mCat);
        });

        //Sortieren
        var sortedValue = filteredValue.sort(function (left, right) {
            if (left.RelatedResult() && right.RelatedResult()) {
                if (left.RelatedResult().Rank() && right.RelatedResult().Rank()) {
                    return left.RelatedResult().Rank() - right.RelatedResult().Rank();
                } else {
                    return left.RelatedResult().Bib() - right.RelatedResult().Bib();
                }
            } else {
                return -1;
            }

        });



        return sortedValue;
    }, this);

    this.competitorFacts = ko.computed(function () {
        var mId = "";
        if (this.CurrentResultRow()) mId = this.CurrentResultRow().IBUId();

        return ko.utils.arrayFilter(this.Facts(), function (m) {
            return (m.IBUId() === mId);
        });

    }, this);


    this.FactCategories = ko.observableArray([]);
    this.triggerFactCategories = ko.observable(0);

    this.UsedFactCategories = ko.computed(function () {
        var x = this.triggerFactCategories();
        var y=ko.utils.arrayFilter(this.FactCategories(), function (m) {
            return m.InUse();
        });
        return y;
    }, this);
    this.CurrentFactCategory = ko.observable();
    this.CurrentFactCategory.subscribe(function (newValue) {
        var old = ko.utils.arrayFirst(RootModel.sportapi.FactCategories(), function (m) {
            return m.IsCurrent() || false;
        });
        if (old) old.IsCurrent(false);
        newValue.IsCurrent(true);
    });


    //Statistics
    this.Stats = ko.observableArray([]);
    this.CurrentStatItem = ko.observable();
    this.CurrentStatItem.subscribe(function (newValue) {
        var old = ko.utils.arrayFirst(RootModel.sportapi.StatItems(), function (m) {
            return m.IsCurrent() || false;
        });
        if (old) old.IsCurrent(false);
        newValue.IsCurrent(true);
        self.LoadStats();
    });
    this.StatDetails = ko.observableArray([]);
    this.CurrentStatRow = ko.observable();
    this.CurrentStatRow.subscribe(function (newValue) {
        var old = ko.utils.arrayFirst(RootModel.sportapi.Stats(), function (m) {
            return m.IsCurrent() || false;
        });
        if (old) old.IsCurrent(false);
        newValue.IsCurrent(true);
        self.LoadStatDetails();
    });


    this.StatCategories = ko.observableArray([]);
    this.CurrentStatCategory = ko.observable();
    this.CurrentStatCategory.subscribe(function (newValue) {
        var old = ko.utils.arrayFirst(RootModel.sportapi.StatCategories(), function (m) {
            return m.IsCurrent() || false;
        });
        if (old) old.IsCurrent(false);
        newValue.IsCurrent(true);
    });
    this.filteredStatItems = ko.computed(function () {
        var CatId = "";
        if (this.CurrentStatCategory()) CatId = this.CurrentStatCategory().Category();
        return ko.utils.arrayFilter(this.StatItems(), function (item) {
            return (item.Category() === CatId);
        });

    }, this);


    //MediaAssets
    this.MediaAssetCategories = ko.observableArray([]);
    this.MediaAssets = ko.observableArray([]);
    this.CurrentMediaAssetCategory = ko.observable();
    this.CurrentMediaAssetCategory.subscribe(function (newValue) {
        var old = ko.utils.arrayFirst(self.MediaAssetCategories(), function (m) {
            return m.IsCurrent() || false;
        });
        if (old) old.IsCurrent(false);
        newValue.IsCurrent(true);
    });
    this.filteredMediaAssets = ko.computed(function () {        
        var mCat = "";
        if (self.CurrentMediaAssetCategory()) mCat = self.CurrentMediaAssetCategory().Format();

        return ko.utils.arrayFilter(self.MediaAssets(), function (item) {
            return (item.Format() === mCat);
        });
    }, this);

    this.CurrentMediaAsset = ko.observable();
    this.CurrentMediaAsset.subscribe(function (newValue) {
        var old = ko.utils.arrayFirst(self.MediaAssets(), function (m) {
            return m.IsCurrent() || false;
        });
        if (old) old.IsCurrent(false);
        if (newValue) newValue.IsCurrent(true);
    });



    this.Init = function () {
        this.CheckQueryString();

        this.LoadSeasons();
        this.LoadOrganizers();
        this.LoadFactItems();
        this.LoadStatItems();

        this.initSignals();

        if (this.qCupId) {
            //Cup laden
        }
    }
    

    this.initSignals = function () {
        if (self.Settings.useSignals == true) {
            
            self.SignalHub = $.hubConnection(self.Settings.serviceURI+"signalr");
            var signalHubProxy = self.SignalHub.createHubProxy('SportSignal');
            signalHubProxy.on('sendSignal', function (data) {
                var waitDelay=Math.floor((Math.random() * 5000) + 1);
                if (waitDelay < 1000) waitDelay = 1000;
                window.setTimeout(function () {
                    self.processSignal(data);
                }, waitDelay);
            });

        }

    }


    this.listenSignals = ko.observable(false);
    this.listenSignals.subscribe(function (newValue) {
        if (newValue) {
            self.SignalHub.start({ waitForPageLoad: false });
        } else {
            self.SignalHub.stop();
        }
    });

    this.processSignal = function (data) {
        var fields=data.split(";")
        if (fields[0] === "DOC" && this.CurrentCompetition() && this.CurrentCompetition().RaceId() === fields[1]) {
            self.LoadCompetitionReports();
        }
        if (fields[0] === "RESULTS" && this.CurrentCompetition() && this.CurrentCompetition().RaceId() === fields[1]) {
            self.LoadCompetitionResults();
        }
        if (fields[0] === "FACTS" && this.CurrentCompetition() && this.CurrentCompetition().RaceId() === fields[1]) {
            self.LoadCompetitionFacts();
        }
        if (fields[0] === "CUP" && this.CurrentCup() && this.CurrentCup().CupId() === fields[1]) {
            self.LoadCupResults();
        }
        if (fields[0] === "COMPETITIONS" && this.CurrentSportEvent().EventId() === fields[1]) {
            RootModel.sportapi.LoadEventCompetitions(true);
        }

    }

    //Querystring
    this.CheckQueryString = function () {
        self.qSeasonId = $.QueryString["SeasonId"];
        self.qEventId = $.QueryString["EventId"];
        self.qCupId = $.QueryString["CupId"];
        self.qRaceId = $.QueryString["RaceId"];

        if (self.qEventId) self.qSeasonId = self.qEventId.substr(2, 4);
        if (self.qCupId) self.qSeasonId = self.qCupId.substr(2, 4);

        if (self.qRaceId) {
            self.qSeasonId = self.qRaceId.substr(2, 4);
            self.qEventId=self.qRaceId.substr(0,14);
        }

    }

    //Loaders
    this.LoadSeasons=function() {


        var lData = RootModel.storage.get("Seasons");
        if (lData) {
            RootModel.sportapi.MapSeasons(lData);
            return;
        }

        RootModel.app.StartLoadOperation();

        //Saisonen laden
        $.ajax({
            url: self.Settings.serviceURI + "api/Seasons",
            dataType: self.Settings.transport,
            success: function (data) {
                RootModel.storage.set("Seasons", data);
                RootModel.sportapi.MapSeasons(data);
                RootModel.app.EndLoadOperation();
                ko.postbox.publish("sportapi", "seasons_loaded");
            },
            error: function (err,errTxt) {
                //alert("error:"+errTxt);
                RootModel.app.EndLoadOperation(true);
            }
        });

    }

    this.MapSeasons=function(data) {
        var CurrentOne = null;
        var i = 0;
        for (i = 0; i < data.length; i++) {
            var IsCurrent = data[i].IsCurrent;
            var NewSeason = new Season(data[i].SeasonId, data[i].Description, data[i].SortOrder, data[i].IsCurrent);
            RootModel.sportapi.Seasons.push(NewSeason);
            if (NewSeason.IsCurrent() == true) CurrentOne = NewSeason;            
        }
        if (self.qSeasonId) {
            CurrentOne = ko.utils.arrayFirst(self.Seasons(), function (m) {
                return (m.SeasonId() === self.qSeasonId);
            });
            self.qSeasonId = NaN;
        }
        RootModel.sportapi.CurrentSeason(CurrentOne);
    }

    this.LoadOrganizers = function () {
        var lData = RootModel.storage.get("Organizers");
        if (lData) {
            RootModel.sportapi.MapOrganizers(lData);
            return;
        }

        RootModel.app.StartLoadOperation();

        $.ajax({
            url: self.Settings.serviceURI + "api/Organizers",
            dataType: self.Settings.transport,
            success: function (data) {
                RootModel.storage.set("Organizers", data);
                RootModel.sportapi.MapOrganizers(data);
                RootModel.app.EndLoadOperation();
            },
            error: function () {
                RootModel.app.EndLoadOperation(true);
            }
        });

    }
    
    this.MapOrganizers = function (data) {
        var i = 0;
        for (i = 0; i < data.length; i++) {
            var NewOrganizer = new Organizer(data[i].OrganizerId, data[i].Description, data[i].Nat);
            RootModel.sportapi.Organizers.push(NewOrganizer);
        }

        RootModel.sportapi.CurrentOrganizer(RootModel.sportapi.Organizers()[0]);
    }

    this.LoadFactItems=function() {

        //Init Categories
        RootModel.sportapi.FactCategories().push(new FactCategory("RANKS", "Ranking Statistics"));
        RootModel.sportapi.FactCategories().push(new FactCategory("ANAG", "Anagraphy"));
        RootModel.sportapi.FactCategories().push(new FactCategory("PART", "Participation"));
        RootModel.sportapi.FactCategories().push(new FactCategory("COMP", "Course/Competiton"));
        RootModel.sportapi.FactCategories().push(new FactCategory("SHOOT", "Shooting"));
        RootModel.sportapi.FactCategories().push(new FactCategory("GPERF", "General Performance"));
        RootModel.sportapi.FactCategories().push(new FactCategory("IPERF", "Individual Performance"));


        var lData = RootModel.storage.get("FactItems");
        if (lData) {
            RootModel.sportapi.MapFactItems(lData);
            return;
        }

        RootModel.app.StartLoadOperation();

        //Saisonen laden
        $.ajax({
            url: self.Settings.serviceURI + "api/FactItems",
            dataType: self.Settings.transport,
            success: function (data) {
                RootModel.storage.set("FactItems", data);
                RootModel.sportapi.MapFactItems(data);
                RootModel.app.EndLoadOperation();
            },
            error: function () {
                RootModel.app.EndLoadOperation(true);
            }
        });
    }
    this.MapFactItems = function (data) {
        for (i = 0; i < data.length; i++) {
            var NewFactItem = new FactItem(data[i].FactId, data[i].Description, data[i].Explanation, data[i].Category, data[i].VisualType, data[i].DisplayOrder);
            RootModel.sportapi.FactItems.push(NewFactItem);
        }
    }





    this.LoadStatItems=function() {

        //Init Categories
        RootModel.sportapi.StatCategories().push(new FactCategory("WC", "World Cup Statistics"));
        RootModel.sportapi.StatCategories().push(new FactCategory("WCH", "WCH/Medal Statistics"));
        RootModel.sportapi.CurrentStatCategory(RootModel.sportapi.StatCategories()[0]);

        var AvailCode = 1;
        if (RootModel.sportapi.Settings.isMediaCenter == true) AvailCode = 2;
    
        var lData = RootModel.storage.get("StatItems");
        if (lData) {
            RootModel.sportapi.MapStatItems(lData);
            return;
        }

        RootModel.app.StartLoadOperation();

        //StatItems laden
        $.ajax({
            url: self.Settings.serviceURI + "api/StatItems?Availability="+AvailCode,
            dataType: self.Settings.transport,
            cache: false,
            success: function (data) {
                RootModel.storage.set("StatItems", data);
                RootModel.sportapi.MapStatItems(data);
                RootModel.app.EndLoadOperation();
            },
            error: function () {
                RootModel.app.EndLoadOperation(true);
            }
        });
    }


    this.MapStatItems=function(data) {
        for (i = 0; i < data.length; i++) {
            var NewStatItem = new StatItem(data[i].StatisticId, data[i].StatId, data[i].Description, data[i].ShortDescription, data[i].Explanation,
                data[i].Category, data[i].VisualType, data[i].DisplayOrder, data[i].naviSeasons, data[i].naviOrganizers, data[i].graphSeasons, data[i].byAthlete, data[i].AthleteGender, data[i].byNation, data[i].SortDescending);
            RootModel.sportapi.StatItems.push(NewStatItem);
        }
    }

    //Statistik laden
    this.LoadStats = function () {

        RootModel.sportapi.Stats().clear;
        if (!this.CurrentStatItem()) return;

        ko.postbox.publish("sportapi", "stats_loading");
        RootModel.app.StartLoadOperation();

        var StatisticId = this.CurrentStatItem().StatisticId();
        var StatId = this.CurrentStatItem().StatId();
        var byWhat = "";
        var GenderId = "";
        var SeasonId = "";
        var OrganizerId = "";

        if (this.CurrentStatItem().byAthlete()) byWhat = "ATH";
        if (this.CurrentStatItem().byNation()) byWhat = "NAT";
        if (this.CurrentStatItem().AthleteGender()) GenderId = this.CurrentStatItem().AthleteGender();
        if (this.CurrentStatItem().naviSeasons()) SeasonId = RootModel.sportapi.CurrentSeason().SeasonId();
        if (this.CurrentStatItem().naviOrganizers()) OrganizerId = RootModel.sportapi.CurrentOrganizer().OrganizerId();


        $.ajax({
            url: self.Settings.serviceURI + "api/Stats?StatisticId="+StatisticId+"&StatId="+StatId+"&byWhat="+byWhat+"&SeasonId="+SeasonId+"&OrganizerId="+OrganizerId+"&GenderId="+GenderId+"&IBUId=&Nat=",
            dataType: self.Settings.transport,
            success: function (data) {                               
                if (data.AsOf) {
                    var d = new Date(data.AsOf);
                    if (d.getYear() > 0) {
                        RootModel.sportapi.CurrentStatItem().AsOf("As of " + kendo.toString(d, "dd MMM yyyy") + " at " + kendo.toString(d, "HH:mm"));
                    } else {
                        RootModel.sportapi.CurrentStatItem().AsOf("");
                    }
                } else {
                    RootModel.sportapi.CurrentStatItem().AsOf("");
                }

                var mappedStats = $.map(data.Rows, function (item) {
                    return new StatRow(item.Season, item.SortOrder, item.Rank, item.IBUId, item.Name, item.ShortName, item.Nat, item.Value, item.Extra);
                });

                RootModel.sportapi.Stats(mappedStats);
                ko.postbox.publish("sportapi", "stats_loaded");
                RootModel.app.EndLoadOperation();

            },
            error: function () {
                RootModel.app.EndLoadOperation(true);
                ko.postbox.publish("sportapi", "stats_loaded");
            }
        });

    }


    //Details (Seasonsal Progression) einer statistikrow laden
    this.LoadStatDetails = function () {
        self.StatDetails().clear;
        if (!this.CurrentStatRow()) return;
        if (!this.CurrentStatRow().IBUId() && !this.CurrentStatRow().Nat()) return;

        ko.postbox.publish("sportapi", "stats_details_loading");

        var StatisticId = this.CurrentStatItem().StatisticId();
        var StatId = this.CurrentStatItem().StatId();
        var byWhat = "";
        var IBUId = "";
        var Nat = "";
        if (this.CurrentStatRow().IBUId()) IBUId = this.CurrentStatRow().IBUId();
        if (this.CurrentStatRow().Nat()) Nat = this.CurrentStatRow().Nat();
        
        if (this.CurrentStatItem().byAthlete()) byWhat = "ATH";
        if (this.CurrentStatItem().byNation()) byWhat = "NAT";

        $.ajax({
            url: self.Settings.serviceURI + "api/Stats?StatisticId=" + StatisticId + "&StatId=" + StatId + "&byWhat=" + byWhat + "&SeasonId=&OrganizerId=&GenderId=&IBUId="+IBUId+"&Nat="+Nat,
            dataType: self.Settings.transport,
            success: function (data) {
                var mappedStats = $.map(data.Rows, function (item) {
                    return new StatRow(item.Season, item.SortOrder, item.Rank, item.IBUId, item.Name, item.ShortName, item.Nat, item.Value, item.Extra);
                });

                RootModel.sportapi.StatDetails(mappedStats);
                ko.postbox.publish("sportapi", "stats_details_loaded");
                RootModel.app.EndLoadOperation();

            },
            error: function () {
                RootModel.app.EndLoadOperation(true);
                ko.postbox.publish("sportapi", "stats_details_loaded");
            }
        });

    }


    this.LoadCompetitionFacts = function () {
        ko.postbox.publish("sportapi", "facts_loading");
        RootModel.app.StartLoadOperation();
        RootModel.sportapi.Facts().clear;

        var i = 0;
        for (i = 0; i < RootModel.sportapi.FactCategories().length; i++) {
            RootModel.sportapi.FactCategories()[i].Count(0);
            RootModel.sportapi.FactCategories()[i].InUse(false);
        }

        //Ergebnisse laden
        $.ajax({
            url: self.Settings.serviceURI + "api/Facts?RT="+srt+"&RaceId=" + RootModel.sportapi.CurrentCompetition().RaceId(),
            dataType: self.Settings.transport,
            success: function (data) {
                if (data.RaceId === RootModel.sportapi.CurrentCompetition().RaceId()) {
                    var mappedFacts = $.map(data.Values, function (item) {
                        return new FactValue(item.FactId, item.Value, item.IBUId);
                    });

                    RootModel.sportapi.Facts(mappedFacts);
                    ko.postbox.publish("sportapi", "facts_loaded");
                    RootModel.sportapi.triggerFactCategories(RootModel.sportapi.triggerFactCategories() + 1);


                }
                RootModel.app.EndLoadOperation();                     
                if (RootModel.app.LoadOperations() === 0) RootModel.sportapi.syncResultsAndFacts();
            },
            error: function () {
                RootModel.app.EndLoadOperation(true);
                ko.postbox.publish("sportapi", "facts_loaded");
            }
        });

    }


    this.syncResultsAndFacts = function () {
        if (RootModel.sportapi.Settings.isMediaCenter) {
            window.setTimeout(function () {
                var i = 0;
                for (i = 0; i < RootModel.sportapi.Facts().length; i++) {
                    var IBUId = RootModel.sportapi.Facts()[i].IBUId();
                    if (IBUId) {
                        var res = ko.utils.arrayFirst(RootModel.sportapi.ResultRows(), function (item) {
                            return (item.IBUId() === IBUId);
                        });
                        if (res) res.HasMoreInfo(true);
                    }
                }
            }, 1000);
        }
    }

    this.LoadMediaAssets=function(EventId, RaceId, IBUId) {
        if (self.MediaAssetCategories().length==0) {
            self.MediaAssetCategories.push(new MediaAssetCategory("Audio Clips","MP3",0));
            self.MediaAssetCategories.push(new MediaAssetCategory("Pictures","JPG",0));
            self.MediaAssetCategories.push(new MediaAssetCategory("Videos","YT",0));
            self.MediaAssetCategories.push(new MediaAssetCategory("Documents","PDF",0));
            self.CurrentMediaAssetCategory(self.MediaAssetCategories()[0]);
        } else {
            var i=0;
            for (i=0;i<self.MediaAssetCategories().length;i++) {
                self.MediaAssetCategories()[i].Count(0);
            }
        }

        ko.postbox.publish("sportapi", "mediaassets_loading");

        self.MediaAssets([]);
        
        $.ajax({
            url: self.Settings.serviceURI + "api/MediaAssets?RT="+srt+"&EventId="+EventId+"&RaceId="+RaceId+"&IBUId="+IBUId,
            dataType: self.Settings.transport,
            success: function (data) {
                if (data.RaceId === RaceId || data.EventId === EventId || data.IBUId === IBUId) {
                    var mappedAssets = $.map(data.Values, function (item) {
                        return new MediaAsset(item.RegisterDate,item.Description,item.Notes,item.Author,item.Format,item.URI)
                    });
                    self.MediaAssets(mappedAssets);

                    for (i=0;i<self.MediaAssets().length;i++) {
                        var cat=ko.utils.arrayFirst(self.MediaAssetCategories(), function (m) {
                            return (m.Format() === self.MediaAssets()[i].Format())
                        })
                        if (cat) cat.CountOne();
                    }

                    ko.postbox.publish("sportapi", "mediaassets_loaded");
                }
            },
            error: function () {
                ko.postbox.publish("sportapi", "mediaassets_loaded");
            }
        });

    }


    this.LoadAnalysis = function () {
        ko.postbox.publish("sportapi", "analysis_loading");

        RootModel.raceanalysis.initAnalysis(RootModel.sportapi.CurrentCompetition().DisciplineId(),RootModel.sportapi.CurrentCompetition().NrLaps());

        $.ajax({
            url: self.Settings.serviceURI + "api/Analysis?RT="+srt+"&RaceId=" + RootModel.sportapi.CurrentCompetition().RaceId() + "&IBUId="+RootModel.sportapi.CurrentResultRow().IBUId(),
            dataType: self.Settings.transport,
            success: function (data) {
                if (data.RaceId === RootModel.sportapi.CurrentCompetition().RaceId() && data.IBUId === RootModel.sportapi.CurrentResultRow().IBUId()) {
                    RootModel.raceanalysis.parseDBAnalysis(data.Values);
                    ko.postbox.publish("sportapi", "analysis_loaded");
                }
            },
            error: function () {
                ko.postbox.publish("sportapi", "analysis_loaded");
            }
        });

    }


    
    this.LoadSeasonEvents=function() {

        ko.postbox.publish("sportapi", "events_loading");

        RootModel.app.StartLoadOperation();


        RootModel.sportapi.SportEvents().clear;

        //Events laden
        $.ajax({
            url: self.Settings.serviceURI + "api/Events?RT="+srt+"&SeasonId=" + RootModel.sportapi.CurrentSeason().SeasonId() + "&Level=0",
            dataType: self.Settings.transport,
            success: function (data) {
                var mappedEvents = $.map(data, function (item) {
                    var isCurrent = item.IsCurrent;
                    if (self.qEventId) {
                        if (self.qEventId === item.EventId) {
                            isCurrent = true;
                        } else {
                            isCurrent = false;
                        }
                    }
                    return new SportEvent(item.SeasonId, item.EventId, item.Description, item.ShortDescription, item.Organizer, item.Nat, item.StartDate, item.EndDate, item.Level, item.MedalSetId, item.IsActual, isCurrent)
                });

                var wrongSeason=false;

                if (mappedEvents.length > 0) {
                    if (mappedEvents[0].SeasonId() !== self.CurrentSeason().SeasonId()) {
                        wrongSeason = true;
                    }
                }

                if (!wrongSeason) {
                    RootModel.sportapi.SportEvents(mappedEvents);

                    if (self.qEventId) {
                        self.CurrentSportEvent(ko.utils.arrayFirst(self.SportEvents(), function (m) {
                            return (m.EventId() === self.qEventId)
                        }));
                        self.qEventId = NaN;
                    }
                }

                RootModel.app.EndLoadOperation();

                ko.postbox.publish("sportapi", "events_loaded");

            },
            error: function () {
                RootModel.app.EndLoadOperation(true);
                ko.postbox.publish("sportapi", "events_loaded");

            }
        });
    }


    this.LoadSeasonCups = function () {


        ko.postbox.publish("sportapi", "cups_loading");

        RootModel.app.StartLoadOperation();


        RootModel.sportapi.Cups().clear;

        //Cups der Saison laden
        $.ajax({
            url: self.Settings.serviceURI + "api/Cups?SeasonId=" + RootModel.sportapi.CurrentSeason().SeasonId(),
            dataType: self.Settings.transport,
            success: function (data) {
                var mappedCups = $.map(data, function (item) {
                    return new Cup(item.CupId, item.Description, item.ShortDescription, item.Level, item.DisplayOrder)
                });

                RootModel.sportapi.Cups(mappedCups);

                RootModel.app.EndLoadOperation();

                if (self.qCupId) {
                    self.CurrentCup(ko.utils.arrayFirst(self.Cups(), function (m) {
                        return (m.CupId() === self.qCupId)
                    }));
                    self.qCupId = "";
                }


                ko.postbox.publish("sportapi", "cups_loaded");

            },
            error: function () {
                RootModel.app.EndLoadOperation(true);
                ko.postbox.publish("sportapi", "cups_loaded");

            }
        });
    }


    this.LoadCupResults = function () {

        ko.postbox.publish("sportapi", "cupresults_loading");

        RootModel.app.StartLoadOperation();

        RootModel.sportapi.CupResultRows().clear;

        //Ergebnisse laden
        $.ajax({
            url: self.Settings.serviceURI + "api/CupResults?RT="+srt+"&CupId=" + RootModel.sportapi.CurrentCup().CupId(),
            dataType: self.Settings.transport,
            success: function (data) {
                var mappedCupResults = $.map(data.Rows, function (item) {
                    return new CupResultRow(item.ResultOrder, item.Rank, item.IBUId, item.Name, item.ShortName, item.Nat, item.Score)
                });
                RootModel.sportapi.CupResultRows(mappedCupResults);

                //Favorites
                if (RootModel.favorites) {
                    var i = 0;
                    for (i = 0; i < RootModel.sportapi.CupResultRows().length; i++) {
                        RootModel.sportapi.CupResultRows()[i].IsFavorite(RootModel.favorites.IsFavorite(RootModel.sportapi.CupResultRows()[i].IBUId()));
                    }
                }

                RootModel.app.EndLoadOperation();

                ko.postbox.publish("sportapi", "cupresults_loaded");
            },
            error: function () {
                RootModel.app.EndLoadOperation(true);

                ko.postbox.publish("sportapi", "cupresults_loaded");

            }
        });
    }

    this.LoadEventCompetitions=function(IsReload) {

        ko.postbox.publish("sportapi", "competitions_loading");

        RootModel.app.StartLoadOperation();

        if (!IsReload) {
            RootModel.sportapi.Competitions().clear;
        }

        //Saisonen laden
        $.ajax({
            url: self.Settings.serviceURI + "api/Competitions?RT="+srt+"&EventId=" + RootModel.sportapi.CurrentSportEvent().EventId(),
            dataType: self.Settings.transport,
            success: function (data) {


                if (IsReload) {
                    var i = 0;
                    for (i = 0; i < data.length; i++) {
                        var ex = ko.utils.arrayFirst(self.Competitions(), function (m) {
                            return (m.RaceId() === data[i].RaceId)
                        });
                        if (ex) {
                            ex.StartTime(new Date(data[i].StartTime));
                            ex.StatusId(data[i].StatusId);
                            ex.StatusText(data[i].StatusText);
                            ex.HasAnalysis(data[i].HasAnalysis);
                        }
                    }
                } else {
                    var mappedCompetitions = $.map(data, function (item) {
                        return new Competition(item.RaceId, item.Description, item.ShortDescription, item.StartTime, item.StatusId, item.StatusText, item.DisciplineId, item.HasAnalysis)
                    });

                    RootModel.sportapi.Competitions(mappedCompetitions);

                    if (self.qRaceId) {
                        self.CurrentCompetition(ko.utils.arrayFirst(self.Competitions(), function (m) {
                            return (m.RaceId() === self.qRaceId)
                        }));
                        self.qRaceId = "";
                    }
                }

                RootModel.app.EndLoadOperation();

                ko.postbox.publish("sportapi", "competitions_loaded");

            },
            error: function () {
                RootModel.app.EndLoadOperation(true);
                ko.postbox.publish("sportapi", "competitions_loaded");

            }
        });

    }



    this.LoadEventMedalResults = function () {
        ko.postbox.publish("sportapi", "medalresults_loading");

        RootModel.app.StartLoadOperation();

        RootModel.sportapi.MedalResults().clear;
        $.ajax({
            url: self.Settings.serviceURI + "api/MedalResults?EventId=" + RootModel.sportapi.CurrentSportEvent().EventId(),
            dataType: self.Settings.transport,
            success: function (data) {
                var mappedMedalResults = $.map(data.Results, function (item) {
                    return new MedalResultsRow(item.SortOrder,item.SortOrder_MedalCount,item.Rank,item.Rank_MedalCount,item.NatName,item.Nat,
                        item.G_M,item.S_M,item.B_M,item.T_M,item.G_W,item.S_W,item.B_W,item.T_W,item.G_X,item.S_X,item.B_X,item.T_X,item.G_T,item.S_T,item.B_T,item.T_T)
                });

                RootModel.sportapi.MedalResults(mappedMedalResults);
                

                RootModel.app.EndLoadOperation();

                ko.postbox.publish("sportapi", "medalresults_loaded");

            },
            error: function () {
                RootModel.app.EndLoadOperation(true);
                ko.postbox.publish("sportapi", "medalresults_loaded");

            }
        });
    }

    this.login = function (username, password) {
        $.ajax({
            url: self.Settings.serviceURI + "api/login?username="+username+"&password="+password,
            dataType: self.Settings.transport,
            success: function (data) {
               
                if (data.Sucess) {
                    RootModel.login.auth(true);
                    RootModel.layout.NavigateTo("home");
                    RootModel.login.token(data.Token);
                    RootModel.login.name(data.Fullname);
                } else {
                    RootModel.login.auth(false);
                    RootModel.login.username("");
                    RootModel.login.password("");
                    RootModel.login.loginError("invalid username and/or password");
                }
            },
            error: function () {
                RootModel.login.loginError("server not available, please retry later");
            }
        });


    }

    this.loginRecover = function (Email) {
        RootModel.login.isRecoveringPassword(true);
        $.ajax({
            url: self.Settings.serviceURI + "api/login?PasswordToEmail=" + Email,
            dataType: self.Settings.transport,
            cache: false,
            success: function (data) {
                RootModel.login.loginError(data);
                RootModel.login.isRecoveringPassword(false);
                RootModel.login.RecoverMode(false);
            },
            error: function () {
                RootModel.login.loginError("Connection Error");
                RootModel.login.isRecoveringPassword(false);
                RootModel.login.RecoverMode(false);
            }
        });

    }

    this.LoadAthletes = function (FamilyName, GivenName) {
        ko.postbox.publish("sportapi", "athletes_loading");

        RootModel.app.StartLoadOperation();

        RootModel.sportapi.Athletes().clear;


        self.lastAthRequestId=new Date().getMilliseconds().toString();
       
        //Ergebnisse laden
        $.ajax({
            url: self.Settings.serviceURI + "api/Athletes?RT=" + srt + "&FamilyName=" + encodeURIComponent(FamilyName) + "&GivenName=" + encodeURIComponent(GivenName) + "&RequestId=" + self.lastAthRequestId,
            dataType: self.Settings.transport,
            contentType: "application/x-www-form-urlencoded;charset=UTF-8",
            success: function (data) {


                if (data.RequestId === self.lastAthRequestId) {
                    var mappedAthletes = $.map(data.Athletes, function (item) {
                        return new Athlete(item.IBUId, item.FamilyName, item.GivenName, item.otherFamilyNames, item.otherGivenNames, item.NAT, item.NF, item.Birthdate,item.Age,item.GenderId,item.Functions)
                    });
                    RootModel.sportapi.Athletes(mappedAthletes);
                }
                RootModel.app.EndLoadOperation();                    
                ko.postbox.publish("sportapi", "athletes_loaded");
            },
            error: function () {
                RootModel.app.EndLoadOperation(true);
                ko.postbox.publish("sportapi", "athletes_loaded");
            }
        });
    }


    this.LoadBiosValues = function (IBUId) {
        ko.postbox.publish("sportapi", "biosvalues_loading");

        RootModel.app.StartLoadOperation();

        RootModel.sportapi.BiosValues().clear;

        //Ergebnisse laden
        $.ajax({
            url: self.Settings.serviceURI + "api/bios?RT="+srt+"&IBUId="+IBUId,
            dataType: self.Settings.transport,
            success: function (data) {
                if (data.IBUId === IBUId) {
                    var mappedBiosValues = $.map(data.Bios, function (item) {
                        return new BiosValue(item.Group, item.Description, item.Value)
                    });
                    RootModel.sportapi.BiosValues(mappedBiosValues);
                }
                RootModel.app.EndLoadOperation();
                ko.postbox.publish("sportapi", "biosvalues_loaded");
            },
            error: function () {
                RootModel.app.EndLoadOperation(true);
                ko.postbox.publish("sportapi", "biosvalues_loaded");
            }
        });
    }

    this.LoadBiosRankings = function (IBUId,OrganizerId,Level) {
        ko.postbox.publish("sportapi", "biosrankings_loading");

        RootModel.app.StartLoadOperation();

        RootModel.sportapi.BiosRankings().clear;
       
        //Ergebnisse laden
        $.ajax({
            url: self.Settings.serviceURI + "api/bios?RT="+srt+"&IBUId=" + IBUId+"&Organizer="+OrganizerId+"&Level="+Level+"&MC="+self.Settings.isMediaCenter,
            dataType: self.Settings.transport,
            success: function (data) {
                if (data.IBUId === IBUId) {
                    var mappedBiosRankings = $.map(data.Rankings, function (item) {
                        return new BiosRanking(item.Description,item.Individual,item.Sprint,item.Pursuit,item.MassStart,item.Team,item.Relay,item.IndividualTotal,item.Total,item.Place_IN,item.Place_SP,item.Place_PU,item.Place_MS,item.Place_RL)
                    });                    RootModel.sportapi.BiosRankings(mappedBiosRankings);
                }
                RootModel.app.EndLoadOperation();
                ko.postbox.publish("sportapi", "biosrankings_loaded");
            },
            error: function () {
                RootModel.app.EndLoadOperation(true);
                ko.postbox.publish("sportapi", "biosrankings_loaded");
            }
        });
    }




    this.LoadCompetitionResults=function() {

        ko.postbox.publish("sportapi", "results_loading");

        RootModel.app.StartLoadOperation();

        RootModel.sportapi.ResultRows().clear;



        //Ergebnisse laden
        if (RootModel.app.Debug) RootModel.debug.write("Loading Results for RaceId '"+RootModel.sportapi.CurrentCompetition().RaceId()+"'");
        $.ajax({
            url: self.Settings.serviceURI + "api/Results?RT="+srt+"&RaceId=" + RootModel.sportapi.CurrentCompetition().RaceId(),
            dataType: self.Settings.transport,
            success: function (data) {
                if (RootModel.app.Debug) RootModel.debug.write("Loaded for RaceId '" + data.RaceId+"'");
                
                if (data.RaceId === RootModel.sportapi.CurrentCompetition().RaceId()) {
                
                    var mappedResults = $.map(data.Results, function (item) {
                        return new ResultRow(item.StartOrder, item.ResultOrder, item.IRM, item.IBUId, item.Name, item.ShortName, item.Nat, item.Bib, item.StartRow, item.StartLane, item.StartTime, item.Leg, item.Rank, item.Shootings, item.ShootingTotal, item.RunTime, item.TotalTime, item.Behind)
                    });

                    if (RootModel.app.Debug) RootModel.debug.write("mapped");
                    
                    RootModel.sportapi.ResultRows(mappedResults);

                    if (RootModel.app.Debug) RootModel.debug.write("assigned");

                    //Favorites
                    if (RootModel.favorites) {
                        var i = 0;
                        for (i = 0; i < RootModel.sportapi.ResultRows().length; i++) {
                            RootModel.sportapi.ResultRows()[i].IsFavorite(RootModel.favorites.IsFavorite(RootModel.sportapi.ResultRows()[i].IBUId()));
                        }
                    }

                    if (RootModel.app.Debug) RootModel.debug.write("favorites set");

                    ko.postbox.publish("sportapi", "results_loaded");
                    if (RootModel.app.Debug) RootModel.debug.write("triggert sent-finished");

                }
                RootModel.app.EndLoadOperation();
                if (RootModel.app.LoadOperations() === 0) RootModel.sportapi.syncResultsAndFacts();

            },
            error: function () {
                RootModel.app.EndLoadOperation(true);

                ko.postbox.publish("sportapi", "results_loaded");

            }
        });
    }




    this.LoadCompetitionReports = function() {

        ko.postbox.publish("sportapi", "reports_loading");
        RootModel.app.StartLoadOperation();

        RootModel.sportapi.ReportItems().clear;

        //Ergebnisse laden
        $.ajax({
            url: self.Settings.serviceURI + "api/Reports?RaceId=" + RootModel.sportapi.CurrentCompetition().RaceId(),
            dataType: self.Settings.transport,
            success: function (data) {
                var mappedReports = $.map(data, function (item) {
                    return new ReportItem(item.Description, item.URL, item.ReportType,item.Info)
                });
                RootModel.sportapi.ReportItems(mappedReports);
                RootModel.app.EndLoadOperation();

                //Verweise zwischen Results und Facts herstellen
                if (RootModel.app.LoadOperations() === 0) RootModel.sportapi.syncResultsAndFacts();

                ko.postbox.publish("sportapi", "reports_loaded");
            },
            error: function () {
                RootModel.app.EndLoadOperation(true);
                ko.postbox.publish("sportapi", "reports_loaded");
            }
        });
    }



}




//Base Entities
function Current(SeasonId, EventId) {
    this.SeasonId = ko.observable(SeasonId);
    this.EventId = ko.observable(EventId);
}

function Season(SeasonId, Description, SortOrder, IsCurrent) {
    this.SeasonId = ko.observable(SeasonId);
    this.Description = ko.observable(Description);
    this.SortOrder = ko.observable(SortOrder);
    this.IsCurrent = ko.observable(IsCurrent);
}

function Organizer(OrganizerId, Description, Nat) {
    this.OrganizerId = ko.observable(OrganizerId);
    this.Description = ko.observable(Description);
    this.Nat = ko.observable(Nat);

    this.IsCurrent = ko.observable(false);
}




function Athlete(IBUId, FamilyName, GivenName, otherFamilyNames, otherGivenNames, NAT, NF, Birthdate, Age, GenderId, Functions) {
    this.IBUId = ko.observable(IBUId);
    this.FamilyName = ko.observable(FamilyName);
    this.GivenName = ko.observable(GivenName);
    this.otherFamilyNames = ko.observable(otherFamilyNames);
    this.otherGivenNames = ko.observable(otherGivenNames);
    this.NAT = ko.observable(NAT);
    this.NF = ko.observable(NF);
    this.Birthdate = ko.observable(Birthdate);
    this.Age = ko.observable(Age);
    this.GenderId = ko.observable(GenderId);
    this.Functions = ko.observable(Functions);


    this.Function = ko.computed(function () {
        if (this.Functions().substr(0, 4) === "Offi") {
            return this.Functions() + " (" + this.NF() + ")";
        } else return this.Functions();
    }, this);

    this.FamilyNames = ko.computed(function () {
        if (this.otherFamilyNames() && this.otherFamilyNames() !== "") {
            return this.FamilyName() + " (" + this.otherFamilyNames() + ")";
        } else {
            return this.FamilyName();
        }
    }, this);
    
    this.imageURL = ko.computed(function () {
        //TODO: Dieses Size X hier ist Layout abhängig und so nicht schön codiert
        return RootModel.sportapi.Settings.serviceURI + "biosimage/image?IBUId=" + this.IBUId() + "&BiosId=PCHS&SizeX=192";
    }, this);

    this.FlagURI = ko.computed(function () {
        return RootModel.sportapi.Settings.resourceURI + "flags/" + this.NAT() + RootModel.sportapi.Settings.flagsExtensions;
    }, this);

}

function Cup(CupId, Description, ShortDescription, Level, DisplayOrder) {
    this.CupId = ko.observable(CupId);
    this.Description = ko.observable(Description);
    this.ShortDescription = ko.observable(ShortDescription);
    this.Level = ko.observable(Level);
    this.DisplayOrder = ko.observable(DisplayOrder);

    this.IsCurrent = ko.observable(false);
    this.AsOf = ko.observable(new Date());
    this.RaceCount = ko.observable(0);

    //012345678901234567
    //BT1012SWRLCP__SMTS
    this.URL = ko.computed(function () {
        return RootModel.sportapi.Settings.docsURI + "docs/" + this.CupId().substr(2, 4) + "/" + this.CupId().substr(0, 2) + "/" + this.CupId().substr(6, 4) + "/" + this.CupId().substr(14, 4) + ".pdf";
    }, this);
}

function SportEvent(SeasonId, EventId, Description, ShortDescription, Organizer, Nat, StartDate, EndDate, Level, MedalSetId, IsActual, IsCurrent) {
    this.SeasonId = ko.observable(SeasonId);
    this.EventId = ko.observable(EventId);
    this.Description = ko.observable(Description);
    this.ShortDescription = ko.observable(ShortDescription);
    this.Organizer = ko.observable(Organizer);
    this.Nat = ko.observable(Nat);    
    this.StartDate = ko.observable(new Date(StartDate));
    this.EndDate = ko.observable(new Date(EndDate));
    this.Level = ko.observable(Level);
    this.MedalSetId = ko.observable(MedalSetId);
    this.IsActual = ko.observable(IsActual);

    this.IsCurrent = ko.observable(IsCurrent);
}

function Competition(RaceId, Description, ShortDescription, StartTime, StatusId, StatusText, DisciplineId, HasAnalysis) {
    this.RaceId = ko.observable(RaceId);
    this.Description = ko.observable(Description);
    this.ShortDescription = ko.observable(ShortDescription);

    this.StartTime = ko.observable(new Date(StartTime));
    this.StatusId = ko.observable(StatusId);
    this.StatusText = ko.observable(StatusText);
    this.DisciplineId=ko.observable(DisciplineId);
    this.HasAnalysis=ko.observable(HasAnalysis);
    
    this.IsCurrent = ko.observable(false);

    this.NrLaps = ko.computed(function() {
        if ((this.DisciplineId() === "MS") || (this.DisciplineId() === "PU") || (this.DisciplineId() === "IN")) {
            return 5;
        } else {
            return 3;
        }
    },this);

}

function ResultRow(StartOrder, ResultOrder, IRM, IBUId, Name, ShortName, Nat, Bib, StartRow, StartLane, StartTime, Leg, Rank, Shootings, ShootingTotal, RunTime, TotalTime, Behind) {
    var self = this;

    this.StartOrder = ko.observable(StartOrder);
    this.ResultOrder = ko.observable(ResultOrder);
    this.IRM = ko.observable(IRM);
    this.IBUId = ko.observable(IBUId);
    this.Name = ko.observable(Name);
    this.ShortName = ko.observable(ShortName);
    this.Nat = ko.observable(Nat);
    this.Bib = ko.observable(Bib);
    this.StartRow = ko.observable(StartRow);
    this.StartLane = ko.observable(StartLane);
    this.StartTime = ko.observable(new Date(StartTime));
    this.Leg = ko.observable(Leg);
    this.Rank = ko.observable(Rank);
    this.Shootings = ko.observable(Shootings);
    this.ShootingTotal = ko.observable(ShootingTotal);
    this.RunTime = ko.observable(RunTime);
    this.TotalTime = ko.observable(TotalTime);
    this.Behind = ko.observable(Behind);

    this.HasMoreInfo = ko.observable(false);

    this.IsCurrent = ko.observable(false);
    this.IsFavorite = ko.observable(false);

    this.imageURL = ko.computed(function () {
        //TODO: Dieses Size Y hier ist Layout abhängig und so nicht schön codiert
        return RootModel.sportapi.Settings.serviceURI + "biosimage/image?IBUId=" + this.IBUId()+"&BiosId=PCHS&SizeY=170";
    }, this);

    this.RankOrIRM = function () {
        if (this.Leg() && this.Leg()>0) {
            return "";
        } else {
            return this.IRM() || this.Rank();
        }            
    }
    this.BibAndLeg = function () {
        if (this.Leg() && this.Leg() > 0) {
            return this.Bib() + "-" + this.Leg();
        } else {
            return this.Bib();
        }
    }

    this.StartInfo = function () {
        if (self.StartRow()) {
            if (self.Leg()) {
                if (self.Leg() == 0) {
                    return "Row " + self.StartRow();
                } else return "";
            } else return "Row " + self.StartRow();
        } else if (self.StartTime()) {
            var x = kendo.toString(self.StartTime(), "HH:mm:ss");
            if (x.substr(0, 4) === "00:0") x = x.substr(4, 4);
            return x;
        } else return "";
    }

    this.IsTeam = function () {
        if (this.Leg() == 0) {
            return true;
        } else {
            return false;
        }
    }

    this.IsMember = function () {
        if (this.Leg() == 1 || this.Leg() == 2 || this.Leg() == 3 || this.Leg() == 4) {
            return true;
        } else {
            return false;
        }
    }

    this.FlagURI = ko.computed(function () {
        return RootModel.sportapi.Settings.resourceURI + "flags/" + this.Nat() + RootModel.sportapi.Settings.flagsExtensions;
    }, this);

}   



function CupResultRow(ResultOrder, Rank, IBUId, Name, ShortName, Nat, Score) {
    this.ResultOrder = ko.observable(ResultOrder);
    this.Rank = ko.observable(Rank);
    this.IBUId = ko.observable(IBUId);
    this.Name = ko.observable(Name);
    this.ShortName = ko.observable(ShortName);
    this.Nat = ko.observable(Nat);
    this.Score = ko.observable(Score);

    this.HasMoreInfo = ko.observable(false);
    this.IsCurrent = ko.observable(false);
    this.IsFavorite = ko.observable(false);

    this.imageURL = ko.computed(function () {
        //TODO: Dieses Size Y hier ist Layout abhängig und so nicht schön codiert
        return RootModel.sportapi.Settings.serviceURI + "biosimage/image?IBUId=" + this.IBUId() + "&BiosId=PCHS&SizeY=170";
    }, this);

    this.FlagURI = ko.computed(function () {
        return RootModel.sportapi.Settings.resourceURI + "flags/" + this.Nat() + RootModel.sportapi.Settings.flagsExtensions;
    }, this);

}


function ReportItem(Description, URL, ReportType, Info) {
    this.Description = ko.observable(Description);
    this.URL = ko.observable(URL);
    this.ReportType = ko.observable(ReportType);
    this.Info = ko.observable(Info);

    this.IsCurrent = ko.observable(false);
    this.IsFavorite = ko.observable(false);
   
}


function FactItem(FactId, Description, Explanation, Category, VisualType, DisplayOrder) {
    this.FactId=ko.observable(FactId);
    this.Description=ko.observable(Description);
    this.Explanation = ko.observable(Explanation);
    this.Category = ko.observable(Category);
    this.VisualType = ko.observable(VisualType);
    this.DisplayOrder = ko.observable(DisplayOrder);
}

function FactCategory(Category, Description) {
    this.Category = ko.observable(Category);
    this.Description = ko.observable(Description);
    this.InUse = ko.observable(false);
    this.IsCurrent = ko.observable(false);
    this.Count = ko.observable(0);
}


function FactValue(FactId, Value, IBUId) {
    this.FactId = ko.observable(FactId);

    this.FactItem = ko.computed(function () {
        return ko.utils.arrayFirst(RootModel.sportapi.FactItems(), function (item) {
            return (item.FactId() === FactId);
        });
    }, this);

    this.Value=ko.observable(Value);
    this.IBUId = ko.observable(IBUId);

    this.RelatedResult = ko.computed(function () {
        var mId = "";
        if (this.IBUId()) mId = this.IBUId();

        return ko.utils.arrayFirst(RootModel.sportapi.ResultRows(), function (item) {
            return (item.IBUId() === mId);
        });
    }, this);

    var fCat = ko.utils.arrayFirst(RootModel.sportapi.FactCategories(), function (item) {
        return (item.Category() === this.FactItem().Category());
    },this);
    
    if (fCat) {
        fCat.InUse(true);
        fCat.Count(fCat.Count() + 1);
    }

    this.Description = ko.computed(function () {
        var rRes=this.RelatedResult();
        if (rRes) {
            return rRes.Name() + " (" + rRes.Nat() + ")";
        } else {
            return this.FactItem().Description();
        }
    }, this);

    this.FactValue = ko.computed(function () {
        if (this.RelatedResult()) {
            if (this.Value()) {
                return this.FactItem().Description() + ": " + this.Value();
            } else {
                return this.FactItem().Description();
            }
        } else {
            return this.Value();
        }
    }, this);
}





function StatCategory(Category, Description) {
    this.Category = ko.observable(Category);
    this.Description = ko.observable(Description);
    this.InUse = ko.observable(false);
    this.IsCurrent = ko.observable(false);
    this.Count = ko.observable(0);
}

function StatItem(StatisticId, StatId, Description, ShortDescription, Explanation, Category, VisualType, DisplayOrder, naviSeasons, naviOrganizers, graphSeasons, byAthlete, AthleteGender, byNation, SortDescending) {
    this.StatisticId=ko.observable(StatisticId);   
    this.StatId=ko.observable(StatId);
    this.Description=ko.observable(Description);
    this.ShortDescription=ko.observable(ShortDescription);
    this.Explanation=ko.observable(Explanation);
    this.Category=ko.observable(Category);
    this.VisualType=ko.observable(VisualType);
    this.DisplayOrder=ko.observable(DisplayOrder);
    this.naviSeasons = ko.observable(naviSeasons);
    this.naviOrganizers = ko.observable(naviOrganizers);
    this.graphSeasons = ko.observable(graphSeasons);
    this.byAthlete = ko.observable(byAthlete);
    this.AthleteGender = ko.observable(AthleteGender);
    this.byNation=ko.observable(byNation);
    this.SortDescending = ko.observable(SortDescending);    
    this.AsOf = ko.observable("");

    this.IsCurrent = ko.observable(false);
}




function StatRow(Season, SortOrder, Rank, IBUId, Name, ShortName, Nat, Value, Extra) {
    this.Season = ko.observable(Season);
    this.SortOrder = ko.observable(SortOrder);
    this.Rank = ko.observable(Rank);
    this.IBUId = ko.observable(IBUId);
    this.Name = ko.observable(Name);
    this.ShortName = ko.observable(ShortName);
    this.Nat = ko.observable(Nat);
    this.Value = ko.observable(Value);
    this.Extra = ko.observable(Extra);
    
    this.IsCurrent = ko.observable(false);


    //Medals holen
    if (Extra && Extra.indexOf(";") >= 0 && Extra.indexOf("|") >= 0) {
        var Medals = Extra.split(";")[0];
        this.Notes = ko.observable(Extra.split(";")[1]);
        var Countries = this.Notes().split(",");
        if (Countries[0] !== "") {
            this.Nat(Countries[0]);
        }
        this.Notes(this.Notes().substr(4));

        var MedSplit = Medals.split("|");
        if (MedSplit.length === 3) {
            this.Gold = ko.observable(MedSplit[0]);
            this.Silver = ko.observable(MedSplit[1]);
            this.Bronze = ko.observable(MedSplit[2]);
        }        
    }


}


function BiosValue(Group,Description,Value) {
    this.Group=ko.observable(Group);
    this.Description=ko.observable(Description);
    this.Value=ko.observable(Value);
}

function BiosRanking(Description,Individual,Sprint,Pursuit,MassStart,Team,Relay,IndividualTotal,Total,Place_IN,Place_SP,Place_PU,Place_MS,Place_RL)
{
    this.Description = ko.observable(Description);
    this.Individual=ko.observable(Individual);
    this.Sprint=ko.observable(Sprint);
    this.Pursuit=ko.observable(Pursuit);
    this.MassStart=ko.observable(MassStart);
    this.Team=ko.observable(Team);
    this.Relay=ko.observable(Relay);
    this.IndividualTotal=ko.observable(IndividualTotal);
    this.Total=ko.observable(Total);

    this.Place_IN=ko.observable(Place_IN);
    this.Place_SP=ko.observable(Place_SP);
    this.Place_PU=ko.observable(Place_PU);
    this.Place_MS=ko.observable(Place_MS);
    this.Place_RL=ko.observable(Place_RL);   
}

function MedalResultsRow(SortOrder,SortOrder_MedalCount,Rank,Rank_MedalCount,NatName,Nat,G_M,S_M,B_M,T_M,G_W,S_W,B_W,T_W,G_X,S_X,B_X,T_X,G_T,S_T,B_T,T_T) {
    this.SortOrder=ko.observable(SortOrder);
    this.SortOrder_MedalCount=ko.observable(SortOrder_MedalCount);
    this.Rank = ko.observable(Rank);
    this.Rank_MedalCount = ko.observable(Rank_MedalCount);

    this.NatName = ko.observable(NatName);
    this.Nat = ko.observable(Nat);
    this.FlagURI = ko.computed(function () {
        return RootModel.sportapi.Settings.resourceURI + "flags/" + this.Nat() + RootModel.sportapi.Settings.flagsExtensions;
    }, this);

    this.G_M = ko.observable(G_M);
    this.S_M = ko.observable(S_M);
    this.B_M = ko.observable(B_M);
    this.T_M = ko.observable(T_M);

    this.G_W = ko.observable(G_W);
    this.S_W = ko.observable(S_W);
    this.B_W = ko.observable(B_W);
    this.T_W = ko.observable(T_W);

    this.G_X = ko.observable(G_X);
    this.S_X = ko.observable(S_X);
    this.B_X = ko.observable(B_X);
    this.T_X = ko.observable(T_X);

    this.G_T = ko.observable(G_T);
    this.S_T = ko.observable(S_T);
    this.B_T = ko.observable(B_T);
    this.T_T = ko.observable(T_T);

}

function MediaAssetCategory(Description, Format, Count) {
    this.Description = ko.observable(Description);
    this.Format = ko.observable(Format);
    this.Count = ko.observable(Count);
    this.IsCurrent = ko.observable(false);
    this.CountOne = function () {
        this.Count(this.Count()+1);
    }
}
function MediaAsset(RegisterDate,Description,Notes,Author,Format,URI) {
    this.RegisterDate=ko.observable(new Date(RegisterDate));
    this.Description=ko.observable(Description);
    this.Notes=ko.observable(Notes);
    this.Author=ko.observable(Author);
    this.Format=ko.observable(Format);
    this.URI = ko.observable(URI);

    this.FormatedDate = ko.computed(function () {
        if (this.RegisterDate()) {
            return kendo.toString(this.RegisterDate(), "ddd dd MMM HH:mm");
        } else return "";
    }, this);
    this.IsCurrent = ko.observable(false);

}


//RACEANALYSIS
//16 SEP 2012 Christian Winkler

function raceanalysis_init() {
    
    RootModel.raceanalysis = new raceanalysis_model();
    
}



function raceanalysis_model() {
    var self = this;

    this.byLap = ko.observableArray([]);
    this.byProgression = ko.observableArray([]);
    this.sectorTimes = ko.observableArray([]);


    this.progression_3L = ['P11N', 'I11N', 'P12N', 'I12N', 'P1SN', 'R1SN', 'E1SN', 'I1SN',
                         'P21N', 'I21N', 'P22N', 'I22N', 'P2SN', 'R2SN', 'E2SN', 'I2SN',
                         'P31N', 'I31N', 'P32N', 'I32N', 'PFSN', 'FINN'];

    this.progression_5L = ['P11N', 'I11N', 'P12N', 'I12N', 'P1SN', 'R1SN', 'E1SN', 'I1SN',
                         'P21N', 'I21N', 'P22N', 'I22N', 'P2SN', 'R2SN', 'E2SN', 'I2SN',
                         'P31N', 'I31N', 'P32N', 'I32N', 'P3SN', 'R3SN', 'E3SN', 'I3SN',
                         'P41N', 'I41N', 'P42N', 'I42N', 'P4SN', 'R4SN', 'E4SN', 'I4SN',
                         'P51N', 'I51N', 'P52N', 'I52N', 'PFSN', 'FINN'];

    this.DisciplineId = ko.observable();
    this.NrLaps = ko.observable(3);


    //Verfügbare Views
    this.analysisViews = ko.observableArray([]);
    this.analysisViews.push(new analysisView("Summary", "analysis_summary"));
    this.analysisViews.push(new analysisView("Progr. Gap", "analysis_progression"));
    this.analysisViews.push(new analysisView("Sector Times", "analysis_sectors"));
    this.analysisViews.push(new analysisView("Shooting", "analysis_shooting"));


    //Summary aktiv
    this.currentAnalysisView = ko.observable();
    this.currentAnalysisView.subscribe(function (newValue) {
       
        var old=ko.utils.arrayFirst(self.analysisViews(), function (m) {
            return m.IsCurrent() || false;
        });
        if (old) { old.IsCurrent(false); $("#" + old.Visual()).hide(); };
        newValue.IsCurrent(true);
        $("#" + newValue.Visual()).show();
        if (newValue.Description() === "Progr. Gap") self.drawAnalysisProgressionChart();
        if (newValue.Description() === "Sector Times") self.drawSectorChart();

    });
    this.currentAnalysisView(this.analysisViews()[0]);

    this.initAnalysis = function (DisciplineId, NrLaps) {
        self.DisciplineId(DisciplineId);
        self.NrLaps(NrLaps);
        
        //Bestehendes Array behalten, nur Werte löschen (ob das wirklich was  bringt ?)
        if (NrLaps === (self.byLap().length-1)) {
            for (iLap = 0; iLap <= NrLaps ; iLap++) {
                self.byLap()[iLap].clearFields();
            }        
        } else {        //Neu anlegen
            self.byLap([]);
            var iLap = 0;
            for (iLap = 0; iLap < NrLaps ; iLap++) {
                self.byLap.push(new AnalysisLap(iLap+1,"Lap "+(iLap+1)));
            }
            var mTotal = new AnalysisLap(0, "Total");
            self.byLap.push(mTotal);
        }


        self.byProgression([]);

    }


    this.parseDBAnalysis = function (data) {
        var i = 0; var td; var k=0;

        //byLap aufbauen
        for (i = 0; i < data.length; i++) {
            td = data[i];

            if (self.DisciplineId() === "RL") {
                //TODO: Für Staffel noch zu implementieren
            } else {
                if (td.FieldId.substr(0, 1) === "A" && td.FieldId.substr(3, 1) === "C") self.byLap()[self.lapIndex(td.FieldId.substr(2, 1))].Course(new AnalysisValue(td));
                if (td.FieldId.substr(0, 1) === "A" && td.FieldId.substr(3, 1) === "R") self.byLap()[self.lapIndex(td.FieldId.substr(2, 1))].Range(new AnalysisValue(td));
                if (td.FieldId.substr(0, 1) === "A" && td.FieldId.substr(3, 1) === "S") self.byLap()[self.lapIndex(td.FieldId.substr(2, 1))].Lap(new AnalysisValue(td));
                if (td.FieldId.substr(0, 1) === "A" && td.FieldId.substr(3, 1) === "P") self.byLap()[self.lapIndex(td.FieldId.substr(2, 1))].Penalty(new AnalysisValue(td));
                if (td.FieldId.substr(0, 1) === "S" && td.FieldId.substr(2, 2) === "TM") self.byLap()[self.lapIndex(td.FieldId.substr(1, 1))].ShootingTime(new AnalysisValue(td));
                if (td.FieldId.substr(0, 1) === "S" && td.FieldId.substr(2, 2) === "FA") self.byLap()[self.lapIndex(td.FieldId.substr(1, 1))].Shooting(new AnalysisValue(td));
                if (td.FieldId.substr(0, 1) === "I" && td.FieldId.substr(2, 2) === "SN") self.byLap()[self.lapIndex(td.FieldId.substr(1, 1))].Cumulative(new AnalysisValue(td));
                if (td.FieldId === "FINN") self.byLap()[self.lapIndex("T")].Cumulative(new AnalysisValue(td));
            }
        }

        //byProgression aufbauen
        var mFields = (self.NrLaps() === 3) ? self.progression_3L : self.progression_5L;
        for (i = 0; i < mFields.length; i++) {
            for (k = 0; k < data.length; k++) {
                if (data[k].FieldId === mFields[i]) {
                    var ProgValue = new AnalysisProgression(mFields[i], data[k].Value, data[k].Behind, "", "");
                    self.byProgression.push(ProgValue);
                    break;
                }
            }
        }

        self.refreshDiagrams();

    }


    this.refreshDiagrams = function () {
        if (self.currentAnalysisView().Description() === "Progr. Gap") self.drawAnalysisProgressionChart();
        if (self.currentAnalysisView().Description() === "Sector Times") self.drawSectorChart();
    }


    this.parseLiveAnalysis = function (unit, data) {
        var Sectors = ko.utils.arrayFilter(data.Extensions(), function (item) {
            return (item.Code().substr(0, 7) === "SECTOR.");
        });
        self.sectorTimes([]);
        var i = 0;
        for (i = 0; i < Sectors.length; i++) {
            var sectorConfig = unit.UnitConfig(Sectors[i].Code());
            if (Sectors[i].Value() && Sectors[i].Value() > 0 && sectorConfig.Value() && sectorConfig.Value() > 0) {
                var value = Sectors[i].Value() - sectorConfig.Value();
                var x = ((100 * Sectors[i].Value()) / sectorConfig.Value()) - 100;
                self.sectorTimes().push(new AnalysisSector(sectorConfig.Description(), x));
            }
        }

        self.refreshDiagrams();

    }

    this.lapIndex = function (code) {
        if (code === "1") return 0;
        if (code === "2") return 1;
        if (code === "3") return 2;
        if (code === "4") return 3;
        if (code === "5") return 4;
        if (code === "T") return self.NrLaps();
    }



    this.drawAnalysisProgressionChart = function () {

        //Flachmachen
        var mSeries = new Array();
        var mCategories = new Array();

        var mData1 = new Array();               
        var i = 0;
        for (i = 0; i < self.byProgression().length; i++) {
            mCategories.push(self.byProgression()[i].Description());
            mData1.push(parseTimeBehind(self.byProgression()[i].CumulativeBehind()));
        }
       
       
        var mSerie1 = { data: mData1 };


        mSeries.push(mSerie1)

        $("#analysis_progression_chart").kendoChart({
            legend: {
            },
            chartArea: {
                background: ""
            },
            seriesDefaults: {
                type: "line"
            },
            series: mSeries,
            valueAxis: {
                reverse: true,
                labels: {
                    
                },
                color: "#F0F0F0"
            },
            categoryAxis: {
                categories: mCategories,
                color: "#F0F0F0"
            },
            tooltip: {
                visible: true,
                format: "{0}"
            }
        });
    

    }


    this.drawSectorChart = function () {

        //Flachmachen
        var mSeries = new Array();
        var mCategories = new Array();
        var myMin = 100;
        var myMax = -100;
        var mData1 = new Array();
        var i = 0;
        for (i = 0; i < self.sectorTimes().length; i++) {
            mCategories.push(self.sectorTimes()[i].Description);
            mData1.push(self.sectorTimes()[i].Value);
            if (self.sectorTimes()[i].Value < myMin) myMin = self.sectorTimes()[i].Value;
            if (self.sectorTimes()[i].Value > myMax) myMax = self.sectorTimes()[i].Value;
            myMin = parseInt(myMin);
            myMax = parseInt(myMax);
            if ((myMin * -1) > myMax) {
                myMax=myMin*-1;
            } else {
                myMin=myMax*-1;
            }

        }


        var mSerie1 = { data: mData1 };


        mSeries.push(mSerie1)

        $("#analysis_sector_chart").kendoChart({
            legend: {
            },
            chartArea: {
                background: ""
            },
            seriesDefaults: {
                type: "line"
            },
            series: mSeries,
            valueAxis: {
                reverse: true,
                labels: {

                },
                format: "{0:0.0}%",
                color: "#F0F0F0",
                min: myMin,
                max: myMax
            },
            categoryAxis: {
                categories: mCategories,
                color: "#F0F0F0"
            },
            tooltip: {
                visible: true,
                format: "{0:0.0}%"
            }
        });


    }


}




function AnalysisProgression(Description, CumulativeTime, CumulativeBehind, SectorTime, SectorBehind) {
    this.Description = ko.observable(Description);
    this.CumulativeTime = ko.observable(CumulativeTime);
    this.CumulativeBehind = ko.observable(CumulativeBehind);
    this.SectorTime = ko.observable(SectorTime);
    this.SectorBehind = ko.observable(SectorBehind);
}

function AnalysisLap(LapNr, Description, Cumulative, Lap, Shooting, ShootingTime, Course, Range, Penalty) {
    this.LapNr = ko.observable(LapNr);
    this.Description = ko.observable(Description);
    this.Cumulative = ko.observable(Cumulative);
    this.Lap = ko.observable(Lap);
    this.Shooting = ko.observable(Shooting);
    this.ShootingTime = ko.observable(ShootingTime);
    this.Course = ko.observable(Course);
    this.Range = ko.observable(Range);
    this.Penalty = ko.observable(Penalty);

    this.clearFields = function () {
       if (this.Cumulative()) this.Cumulative().clearFields();
       if (this.Lap()) this.Lap().clearFields();
       if (this.Shooting()) this.Shooting().clearFields();
       if (this.ShootingTime()) this.ShootingTime().clearFields();
       if (this.Course()) this.Course().clearFields();
       if (this.Range()) this.Range().clearFields();
       if (this.Penalty()) this.Penalty().clearFields();
    }
}


function AnalysisValue(d) {
    this.FieldId = ko.observable(d.FieldId);
    this.Value = ko.observable(d.Value);
    this.Behind = ko.observable(d.Behind);
    this.Rank = ko.observable(d.Rank);

    this.clearFields = function () {
        this.Value();
        this.Behind();
        this.Rank();
    }
}

function AnalysisSector(Description, Value) {
    this.Description = Description;
    this.Value = Value;
}


function analysisView(Description, Visual) {
    this.Description = ko.observable(Description);
    this.Visual = ko.observable(Visual);
    this.IsCurrent = ko.observable(false);
}


function parseTimeBehind(V) {
    var retV = 0.0;
    var p1 = V.indexOf(":");
    if (p1 >= 0) {
        var tMinutes = parseInt(V.substr(0, p1).replace("+",""));
        var tSec = parseFloat(V.substr(p1 + 1));
        retV = tSec + tMinutes * 60;
    } else {
        retV = parseFloat(V);
    }
    return retV;
}