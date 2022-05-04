// https://stackoverflow.com/questions/8211744/convert-time-interval-given-in-seconds-into-more-human-readable-form
export function millisecondsToStr(milliseconds) {
    if (milliseconds < 0) {
        return null;
    }

    const seconds = Math.floor(milliseconds / 1000);

    const levels = [
        [Math.floor(seconds / 31536000), 'years'],
        [Math.floor((seconds % 31536000) / 86400), 'days'],
        [Math.floor(((seconds % 31536000) % 86400) / 3600), 'hours'],
        [Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 'minutes'],
        [(((seconds % 31536000) % 86400) % 3600) % 60, 'seconds'],
    ];
    let returnText = '';

    for (let i = 0, max = levels.length; i < max; i++) {
        if (levels[i][0] === 0) continue;
        returnText += ' ' + levels[i][0] + ' ' + (levels[i][0] === 1 ? levels[i][1].substr(0, levels[i][1].length - 1) : levels[i][1]);
    }
    ;
    return returnText.trim();
}
