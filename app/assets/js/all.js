// Vue.component必須要放前面才不會報錯
// Vue.component(`網頁標籤元件名稱`, {})
Vue.component(`pagination`, {
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
})

let app = new Vue({
  el: `#app`,
  data: {
    product: {
      title: "test",
      category: "testCategory",
      content: "test",
      description: "test",
      imageUrl: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80"],
      enabled: true,
      origin_price: `2000`,
      price: `1000`,
      unit: "單位"
    },
    hexAPI: {
      personID: `85a8cd22-1b7d-43af-9b5a-5aa679129559`,
      apiPath: `https://course-ec-api.hexschool.io/api/`,
      data: [],
    },
    user: {
      email: ``,
      password: ``,
    },
    pagination:{},
    temporary: [],
  },
  methods: {
    // 功能類 //
    login(e) {
      let vm = this;
      e.preventDefault();
      axios
        .post(`${this.hexAPI.apiPath}auth/login`, this.user)
        .then((res) => {
          // 1. 送出驗證資訊後，驗證完畢取得 token以及到期日(expired)
          const token = res.data.token;
          const expired = res.data.expired;
          // 2. 取得上述的值後，就把它們存在 cookie，以便使用者在期限內再次登入
          // 參考 document.cookie MDN
          // someCookieName可自定義，true改成 傳送回來的 token
          // 到期日則是用 new Data()的方式
          document.cookie = `hexToken=${token}; expires=${new Date(expired * 1000)}; path=/`;
          //清空
          vm.user.email = ``;
          vm.user.password = ``;
          // 跳轉頁面
          window.location = "products.html";

        })
        .catch((error) => {
          console.log(error);
        })
    },
    signout(e) {
      e.preventDefault();
      // 將存放在瀏覽器的 cookie清空
      document.cookie = `hexToken=; expires=; path=/`;
      this.hexAPI.data = [];
      this.hexAPI.token = ``,
      this.hexAPI.tokenName = ``,
      window.location = "index.html";
    },
    /* 取得遠端 API資料 */
    // 預設為 1
    getData(page = 1) {
      let vm = this;
      // axios的驗證指令，Bearer是後端用的
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      axios
        // 原本是 products ->最終結果是取得所有資料
        // 改成 products?page=${page} -> 由後端給第一頁資料
        .get(`${vm.hexAPI.apiPath}${vm.hexAPI.personID}/admin/ec/products?page=${page}`) 
        .then((res) => {
          // 取得該頁資料
          vm.hexAPI.data = res.data.data;
          // 取得分頁資訊
          vm.pagination = res.data.meta.pagination;
        });
    },
    /* 新增資料 */
    addProduct() {
      let vm = this;
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      axios
        .post(`${this.hexAPI.apiPath}${vm.hexAPI.personID}/admin/ec/product`, vm.temporary)
        .then(() => {
          vm.getData();
        });
    },
    /* 新建資料 */
    // 將 this.product的屬性值複製到暫存
    initData() {
      this.temporary = Object.assign({}, this.product);
    },
    /* 複製資料 */
    // 將 v-for所取出的 item放入暫存
    copyData(item) {
      this.temporary = Object.assign({}, item);
    },
    /* 修改資料 */
    updateData() {
      let vm = this;
      // if判斷，若有值則為 true
      if (vm.temporary.id) {
        vm.hexAPI.data.forEach((item) => {
          if (vm.temporary.id === item.id) {
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            // patch跟 post一樣需要兩個參數 patch(`API網址`, 單一物件資料)，否則不會變更
            axios
              .patch(`${this.hexAPI.apiPath}${vm.hexAPI.personID}/admin/ec/product/${vm.temporary.id}`, vm.temporary)
              .then(() => {
                vm.getData();
                vm.cleanDate();
              });
          }
        })
      } else {
        vm.addProduct();
      }
      vm.cleanDate();
    },
    /* 刪除資料 */
    deleteData() {
      let vm = this;
      vm.hexAPI.data.forEach((item) => {
        if (vm.temporary.id === item.id) {
          const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
          axios.defaults.headers.common.Authorization = `Bearer ${token}`;
          axios
            .delete(`${this.hexAPI.apiPath}${vm.hexAPI.personID}/admin/ec/product/${vm.temporary.id}`)
            .then(() => {
              vm.getData();
              vm.cleanDate();
            });
        }
      })
    },
    // 工具類 //
    cleanDate() {
      this.temporary = {};
    },
  },
  // 資料建立之後，適合處理資料
  created() {
    // 要執行的命令都寫在同一檔案，會造成一起執行
    // 必須拆分檔案
    if( this.hexAPI.tokenName === ``){
      window.location = "index.html";
    }
    this.getData();
  },
  // 元件渲染 html後，適合處理 DOM
  mounted() {
    
  }
})


