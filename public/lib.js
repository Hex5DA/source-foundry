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

const GITROOT = "/home/0x5da/projects";

function runSh(command) {
    return server.imports.execSync(command, (error, stdout, stderr) => {
        if (error || stderr) {
            console.warn(`error when trying to run ${command}.\nerror:${error.message}\nstderr:${stderr}`)
            return "";
        }

        return stdout;
    }).toString().trim();
}

function runShExtract(command, ...props) {
    return runSh(command).split("\n").filter(line => line).map(line => {
        const parts = line.split(" ");
        const capped = [...parts.slice(0, props.length - 1), parts.slice(props.length - 1).join(" ")];
        return Object.assign({}, ...props.map((prop, idx) => ({ [prop]: capped[idx] })));
    });
}

const runGit = (repo, command) => runSh(`git --git-dir ${GITROOT}/${repo}/.git ${command}`);
const runGitLines = (repo, command) => runGit(repo, command).split("\n").filter(line => line);
const runGitExtract = (repo, command, ...props) => runShExtract(`git --git-dir ${GITROOT}/${repo}/.git ${command}`, ...props);

function stripEnd(str, pat) {
    return (str ?? "").endsWith(pat) ? str.replace(pat, "") : str;
}

function sanitise(string) {
    return string
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("\"", "&quot;")
        .replaceAll("'", "&#039;")
}

