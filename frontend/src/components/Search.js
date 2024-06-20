// /shop.c4ei.net/frontend/src/components/Search.js
import React, { useRef, useState } from "react";

export default function Search({ handleSearch }) {
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const debounceSearch = useRef(null);

  const onChangeText = (e) => {
    const value = e.target.value;
    setSearch(value);

    // 검색 가능 여부에 따라 에러 메시지 설정
    if (isKorean(value)) {
      if (value.length < 2) {
        setErrorMessage("한글은 2글자 이상 입력하세요.");
      } else {
        setErrorMessage("");
      }
    } else {
      if (value.length < 3) {
        setErrorMessage("영문은 3글자 이상 입력하세요.");
      } else {
        setErrorMessage("");
      }
    }

    // 검색 가능 여부에 따라 입력 필드 활성화/비활성화 설정
    if (isSearchable(value)) {
      if (debounceSearch.current) {
        clearTimeout(debounceSearch.current);
      }
      debounceSearch.current = setTimeout(() => {
        handleSearch(value);
      }, 500);
    }
  };

  const isKorean = (text) => {
    const koreanRegex = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;
    return koreanRegex.test(text);
  };

  const isSearchable = (text) => {
    if (isKorean(text)) {
      return text.length >= 2;
    } else {
      return text.length >= 3;
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    setErrorMessage("");
    handleSearch(""); // 검색 초기화 시에 검색 함수에 빈 문자열을 전달하여 검색 결과를 초기화할 수 있도록 함
  };

  return (
    <div className="col-lg-4">
      <div className="input-group">
        <input
          className="form-control form-control-lg"
          type="text"
          placeholder="Enter Search Here!"
          onChange={onChangeText}
          value={search}
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={handleClearSearch}
          >
            Clear
          </button>
        </div>
      </div>
      {!isSearchable(search) && (
        <small className="text-danger">{errorMessage}</small>
      )}
    </div>
  );
}
