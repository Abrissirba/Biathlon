/** @ngInject */
export function config(
    $logProvider: angular.ILogProvider,
    $translateProvider: any
    ) {
    // enable log
    $logProvider.debugEnabled(true);


    $translateProvider
        .useStaticFilesLoader({
            prefix: '/assets/i18n/',
            suffix: '.json'
        })
        .preferredLanguage('en')
        .fallbackLanguage('en')
        .useSanitizeValueStrategy('escaped');
}
