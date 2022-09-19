import { useLocation } from "react-router";

function Search() {
  const location = useLocation();
  //URLSearchParams는 자바스크립트 내장 객체!
  const keyword = new URLSearchParams(location.search).get("keyword");
  console.log(keyword);
  return null;
}
export default Search;
