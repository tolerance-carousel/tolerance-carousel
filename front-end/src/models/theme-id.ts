export enum ThemeId {
    Religion = 'religion',
    Sexuality = 'sexuality',
    Migration = 'migration',
}

export function isValidThemeIdStr(themeId: string) {
    return (<any>Object).values(ThemeId).includes(themeId);
}

export function getThemeIdByStr(themeId: string): ThemeId {
    return (<any>Object.keys(ThemeId))[(<any>Object.values(ThemeId)).indexOf(themeId)];
}
