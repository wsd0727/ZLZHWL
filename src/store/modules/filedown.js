const filedownStore = defineStore("filedown", {
  state: () => ({
    downList: [],
    downErr: ""
  }),
  actions: {
    setDown(data) {
      if (this.downList.length) {
        if (this.downList.find(item => item.path == data.path)) {
          this.downList.find(item => item.path == data.path).downProgress = data.downProgress
        } else {
          this.downList.push(data)
        }
      } else {
        this.downList.push(data)
      }
    },
    delDown(data) {
      let index = this.downList.findIndex(el => el.path == data)
      this.downList.splice(index, 1)
    }
  }
})

export default filedownStore
