// https://stackoverflow.com/questions/8211744/convert-time-interval-given-in-seconds-into-more-human-readable-form
export function millisecondsToStr(milliseconds) {
    if (milliseconds < 0) {
        return null;
    }

    const seconds = Math.floor(milliseconds / 1000);

    const levels = [
        [Math.floor(seconds / 31536000), 'year'],
        [Math.floor((seconds % 31536000) / 86400), 'days'],
        [Math.floor(((seconds % 31536000) % 86400) / 3600), 'hour'],
        [Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 'minutes'],
        [(((seconds % 31536000) % 86400) % 3600) % 60, 'seconds'],
    ];
    let returnText = '';

    for (let i = 0, max = levels.length; i < max; i++) {
        if (levels[i][0] === 0) continue;
        if(levels[i][0] === 1) {
            if(i === 1) {
                levels[i][1] = 'day';
            }
            if(i === 3) {
                levels[i][1] = 'minute';
            }
            if(i === 4) {
                levels[i][1] = 'second';
            }
        }
        returnText += ' ' + levels[i][0] + ' ' + levels[i][1];
    }

    return returnText.trim();
}
