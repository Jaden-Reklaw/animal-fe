import { NavLink } from "react-router-dom";

type NavBarProps = {
    userName: string | undefined;
    onLogout?: () => void;
};
export default function NavBar({ userName, onLogout }: NavBarProps) {

    function renderLoginLogout() {
        if (userName) {
            return (
                <NavLink to="/" style={{ float: "right" }} onClick={onLogout}>
                    {userName}
                </NavLink>
            );
        } else {
            return (
                <NavLink to="/login" style={{ float: "right" }}>
                    Login
                </NavLink>
            );
        }
    }

    return (
        <div className="navbar">
            <NavLink to={"/"}>Home</NavLink>
            <NavLink to={"/profile"}>Profile</NavLink>
            <NavLink to={"/animals"}>Animals</NavLink>
            <NavLink to={"/createAnimals"}>Create Animals</NavLink>
            {renderLoginLogout()}
        </div>
    );
}