<template>
  <div class="pagination">
    <ul class="paginate-links items">
        <li
          v-for="page in pages" :class="isActive(page) ? 'active' : '' "
          v-on:click="$emit('change-page', page)">
          <a>{{ page }}</a>
        </li>
    </ul>
    <ul class="paginate-links items">
        <li
          class="left-arrow" :class="isActive(1) ? 'disabled' : '' "
          v-on:click="$emit('prev-page')">
          <a>«</a>
        </li>
        <li
          class="right-arrow" :class="isActive(pages.length) ? 'disabled' : '' "
          v-on:click="$emit('next-page')">
          <a>»</a>
        </li>
    </ul>
  </div>
</template>
<script>

export default {
  props: {
    pages: {
      type: Array,
      default: [1],
    },
    currentPage:{
      type: Number,
    },
  },
  methods: {
    isActive: function(page) {
        return page == this.currentPage;
    },
  }
};
</script>

<style>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

.paginate-list {
  width: 90%;
  margin: 0 auto;
  text-align: left;
}

.paginate-list>li {
  display: block;
}

.paginate-list>li:before {
  content: '⚬ ';
  font-weight: bold;
  color: slategray;
}

.paginate-links.items {
  user-select: none;
}

.paginate-links.items>li.active a {
  font-weight: bold;
}
.paginate-links.items>li.next:before {
  content: ' | ';
  margin-right: 13px;
  color: #ddd;
}
.paginate-links.items>li.disabled a {
  color: #ccc;
  cursor: no-drop;
}

a {
  color: #42b983;
  cursor: pointer;
}
</style>
