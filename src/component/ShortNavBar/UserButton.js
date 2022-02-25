function UserButton(props) {
  return (
    <div class="dropdown is-hoverable mb-2">
      <div class="dropdown-trigger">
        <a
          class="navbar-admin-button"
          aria-haspopup="true"
          aria-controls="dropdown-menu4"
        >
          <span>Helios Admin</span>
          <span class="icon is-small">
            <i class="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </a>
      </div>
      <div class="dropdown-menu mt-2" id="dropdown-menu4" role="menu">
        <div class="dropdown-item">
          <a>Log out</a>
        </div>
      </div>
    </div>
  );
}

export default UserButton;
