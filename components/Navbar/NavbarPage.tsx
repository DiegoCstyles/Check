import Link from "next/link"

interface SideNavbarProps {
    page: string;
    pageTitle: string;
    className?: string;
}

const NavbarPage = ({ page, pageTitle, className }: SideNavbarProps) => {
    return (

            <Link className={"text-xs p-2 "+ className} aria-current="page" href={"/"+ page}>{pageTitle.toUpperCase()}</Link>

      )
}

export default NavbarPage