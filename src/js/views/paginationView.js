import icons from "url:../../img/icons.svg";
import View from "./View.js";

class PaginationView extends View{
    _parentEl = document.querySelector(".pagination");
    addHandlerClick(hanlder){
      this._parentEl.addEventListener("click", function (e){
        const btn = e.target.closest(".btn--inline");
        if (!btn) return;
        // console.log("going to pageNum: ", btn.dataset.goto);
        hanlder(+btn.dataset.goto);
      }); 
    };
    _generateMarkup(){

      const totalPages = Math.ceil(this._data.results.length / this._data.resultsPerPage); // [].length / 10
      const currentPage = this._data.currentPage;
      // console.log(totalPages, currentPage);
      
      // only 1 page
      if (totalPages === 1){
        return ``;
      }
      // are other pages, we are page on 1
      if (totalPages > 1 && currentPage === 1) {
        // console.log("first page");
        return `
        <button data-goto=${(currentPage + 1)} class="btn--inline pagination__btn--next">
          <span>Page ${(currentPage + 1)}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
        `;
      }
      // are other pages, we are on page 1+n ,  
      if (totalPages > 1 && currentPage > 1 && totalPages !== currentPage){
        return `
          <button data-goto=${(currentPage - 1)} class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${(currentPage - 1)}</span>
          </button>
          <button data-goto=${(currentPage + 1)} class="btn--inline pagination__btn--next">
            <span>Page ${(currentPage + 1)}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
        `;
      }
      // page n, no other pages
      if (totalPages === currentPage){
        // console.log("last page");
        return `
        <button data-goto=${(currentPage - 1)} class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span> Page ${(currentPage - 1)}</span>
        </button>
        `;
      }
      // no pages 
      if (totalPages <= 0){
        // console.log("no pages");
        return ``;  
      }



      // return `
      //   <button class="btn--inline pagination__btn--prev">
      //     <svg class="search__icon">
      //       <use href="${icons}#icon-arrow-left"></use>
      //     </svg>
      //     <span>Page 1</span>
      //   </button>
      //   <button class="btn--inline pagination__btn--next">
      //     <span>Page 3</span>
      //     <svg class="search__icon">
      //       <use href="${icons}#icon-arrow-right"></use>
      //     </svg>
      //   </button>
      //   `;
    }
}
export default new PaginationView();