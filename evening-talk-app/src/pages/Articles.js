import useUser from "../hooks/useUser";

const Articles = () => {
  const { user, isLoading } = useUser();

  return (
    <div>
      <h1>Articles</h1>
      {user ? <p>User logged in</p> : <p>Please log in</p>}
    </div>
  );
};

export default Articles;
