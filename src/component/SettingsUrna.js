function SettingsUrna(props) {
  const electionPrivate = false;
  const categories = false;
  return (
    <>
      <div className="d-flex justify-content-center">
        {electionPrivate ? (
          <em>
            Your election is marked private, which means you cannot open
            registration up more widely
          </em>
        ) : (
          <div>
            You can change this setting
            <form method="post">
              <input type="hidden" name="csrf_token" value="{{csrf_token}}" />
              <input type="radio" name="eligibility" value="openreg" /> Anyone
              can vote
              <br />
              <input type="radio" name="eligibility" value="closedreg" /> Only
              voters listed explicitly below can vote
              <br />
              {categories && (
                <>
                  <input type="radio" name="eligibility" value="limitedreg" />{" "}
                  only voters who are members of
                  <select name="category_id">
                    {categories.map((category) => {
                      return <option value={category.id}></option>;
                    })}
                  </select>
                  <br />
                </>
              )}
              <br />
              <input type="submit" value="Update" />
            </form>
          </div>
        )}
      </div>
      
    </>
  );
}

export default SettingsUrna;
