export default {
  // 建立樣板
  template: `
  <nav aria-label="Page navigation example">
    <ul class="pagination mx-auto">
      <li class="page-item" v-if="pages.current_page != 1">
        <a class="page-link" href="#" aria-label="Previous" @click.prevent="emitPages(pages.current_page - 1)">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item" v-for="(item, index) in pages.total_pages" :key="index">
        <a class="page-link" href="#" @click.prevent="emitPages(item)">
          {{ item }}
        </a>
      </li>
      
      <li class="page-item" v-if="pages.current_page != pages.total_pages">
        <a class="page-link" href="#" aria-label="Next" @click.prevent="emitPages(pages.current_page + 1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>`,
  // 定義資料，元件的 data必須使用 return的方式回傳資料，與 new Vue的 data不同
  data() {
    return {
      // 此元件只會讀取該元件的 data資料
      // icon:`left`,
    };
  },
  // 定義樣板屬性，用陣列方式定義，接著在網頁中寫 pages=某值或其他函式，資料就會寫入樣板中
  // 但是範例為什麼是用物件? 可用來驗證傳入的資料，驗證型別(type)、自訂條件(validator)、預設值(default)等等
  // props: [`pages`],
  props: {
    // pages:Object, //直接指定型別
    pages:{
      type:Object,
      // validator:,
      // default:``,
    }
  },
  methods:{
    emitPages(item){
      this.$emit(`emit-pages`, item);
    },
  },
}




// Vue.component必須要放前面才不會報錯
// Vue.component(`網頁標籤元件名稱`, {})
// Vue.component(`pagination`, {
//   // 建立樣板
//   template: `
//   <nav aria-label="Page navigation example">
//     <ul class="pagination mx-auto">
//       <li class="page-item" v-if="pages.current_page != 1">
//         <a class="page-link" href="#" aria-label="Previous" @click.prevent="emitPages(pages.current_page - 1)">
//           <span aria-hidden="true">&laquo;</span>
//         </a>
//       </li>
//       <li class="page-item" v-for="(item, index) in pages.total_pages" :key="index">
//         <a class="page-link" href="#" @click.prevent="emitPages(item)">
//           {{ item }}
//         </a>
//       </li>
      
//       <li class="page-item" v-if="pages.current_page != pages.total_pages">
//         <a class="page-link" href="#" aria-label="Next" @click.prevent="emitPages(pages.current_page + 1)">
//           <span aria-hidden="true">&raquo;</span>
//         </a>
//       </li>
//     </ul>
//   </nav>`,
//   // 定義資料，元件的 data必須使用 return的方式回傳資料，與 new Vue的 data不同
//   data() {
//     return {
//       // 此元件只會讀取該元件的 data資料
//       // icon:`left`,
//     };
//   },
//   // 定義樣板屬性，用陣列方式定義，接著在網頁中寫 pages=某值或其他函式，資料就會寫入樣板中
//   // 但是範例為什麼是用物件? 可用來驗證傳入的資料，驗證型別(type)、自訂條件(validator)、預設值(default)等等
//   // props: [`pages`],
//   props: {
//     // pages:Object, //直接指定型別
//     pages:{
//       type:Object,
//       // validator:,
//       // default:``,
//     }
//   },
//   methods:{
//     emitPages(item){
//       this.$emit(`emit-pages`, item);
//     },
//   },
// })
