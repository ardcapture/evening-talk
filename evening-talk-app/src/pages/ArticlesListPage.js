import ArticlesList from "../components/ArticlesList";
import articles from "./article-content";
import useUser from "../hooks/useUser";

const ArticlesListPage = () => {
  const { user, isLoading } = useUser();

  return (
    <div>
      <h1>Articles</h1>
      <ArticlesList articles={articles} />
      {user ? <p>User logged in</p> : <p>Please log in</p>}
    </div>
  );
};

export default ArticlesListPage;
