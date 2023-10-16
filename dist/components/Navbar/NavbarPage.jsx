import Link from "next/link";
var NavbarPage = function (_a) {
    var page = _a.page, pageTitle = _a.pageTitle, className = _a.className;
    return (<Link className={"text-xs p-2 " + className} aria-current="page" href={"/" + page}>{pageTitle.toUpperCase()}</Link>);
};
export default NavbarPage;
