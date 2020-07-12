
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
      origin_price: 0,
      price: 0,
      unit: "單位"
    },
    hexAPI: {
      personID: `85a8cd22-1b7d-43af-9b5a-5aa679129559`,
      apiPath: `https://course-ec-api.hexschool.io/api/`,
      data: [],
      token: ``
    },
    user: {
      email: ``,
      password: ``,
    },
    temporary: [],
  },
  methods: {
    // 功能類 //
    // login算全域還是區域註冊呢 ?
    // 範例中是寫在該網頁上，data資料必須用 return的方式傳出
    login(e) {
      let vm = this;
      e.preventDefault();
      axios
        .post(`${this.hexAPI.apiPath}auth/login`, this.user)
        .then((res) => {
          console.log(res);
          // 1. 送出驗證資訊後，驗證完畢取得 token以及到期日(expired)
          vm.token = res.data.token;
          const expired = res.data.expired;
          // 2. 取得上述的值後，就把它們存在 cookie，以便使用者在期限內再次登入
          // 參考 document.cookie MDN
          // someCookieName可自定義，true改成 傳送回來的 token
          // 到期日則是用 new Data()的方式
          document.cookie = `hexToken=${vm.token}; expires=${new Date(expired * 1000)}; path=/`;
          console.log("登入成功!")
        })
        .catch((error) => {
          console.log(error);
        })
    },
    signout() {
      document.cookie = `hexToken=; expires=; path=/`;
    },
    /* 取得遠端 API資料 */
    getData() {
      let vm = this;
      // 取得 cookie的 token資料
      // 範例中的 test2替換成自訂義的名稱，也就是在 login(){}裡，document.cookie的自取名稱 hexToken
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      // axios的驗證指令，Bearer是後端用的
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      axios
        // /ec/products是給前端資料
        // .get(`${vm.hexAPI.apiPath}${vm.hexAPI.personID}/ec/products`)
        .get(`${vm.hexAPI.apiPath}${vm.hexAPI.personID}/admin/ec/products`)
        .then((res) => {
          vm.hexAPI.data = res.data.data;

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
    initData() {
      this.temporary = Object.assign({}, this.product);
    },

    /* 複製資料 */
    copyData(item) {
      let vm = this;
      vm.temporary = Object.assign({}, item);
    },
    /* 修改與更新資料 */
    updateData() {
      let vm = this;

      if (vm.temporary.id) {
        vm.hexAPI.data.forEach((item) => {
          if (vm.temporary.id === item.id) {
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            // patch跟 post一樣需要兩個參數 patch(`API網址`, 單一物件資料)
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
    isUpFn(isUp) {
      if (isUp) {
        return `已開放`;
      } else {
        return `未開放`;
      }
    },
    // 工具類 //
    cleanDate() {
      this.temporary = {};
    },
  },
  // 渲染畫面前
  created() {
    this.getData();
  },
  // 渲染畫面後
  mounted() {
    // this.getData();
  }
})