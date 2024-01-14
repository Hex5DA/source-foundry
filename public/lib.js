// <https://stackoverflow.com/a/69122877>
function getFormattedTime(time) {
    const date = time instanceof Date ? time : new Date(time);
    const fmt = new Intl.RelativeTimeFormat("en");
    const ranges = {
        years: 1 * 60 * 60 * 24 * 365,
        months: 1 * 60 * 60 * 24 * 30,
        weeks: 1 * 60 * 60 * 24 * 7,
        days: 1 * 60 * 60 * 24,
        hours: 1 * 60 * 60,
        minutes: 1 * 60,
        seconds: 1,
    };

    const elapsed = (date.getTime() - Date.now()) / 1000;
    for (const [range, interval] of Object.entries(ranges)) {
        if (interval < Math.abs(elapsed)) {
            return fmt.format(Math.round(elapsed / interval), range);
        }
    }
}

function runSh(command) {
   return server.imports.execSync(command, (error, stdout, stderr) => {
        if (error || stderr) {
            console.warn(`error when trying to run ${command}.\nerror:${error.message}\nstderr:${stderr}`)
            return "";
        }

        return stdout;
   }).toString();
}

