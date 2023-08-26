<template> 
 <div id="app" >
    <div class="navbar-text navbar-nav m-3 w-auto sidebar shadow p-4">
      <!-- Navigation panels -->
      <router-link to="/" class="text-decoration-none "   ><i class="fas fa-home m-2"></i> </router-link>
      <br>
      <router-link to="/coverage" class="text-decoration-none " ><i class="fas fa-map m-2"></i> </router-link>
    </div>

    <div class="content">
      <!-- Main content -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
 import 'bootstrap/dist/css/bootstrap.css';
export default {
  name: 'App',
}
</script>

<style>
html { overflow-y: hidden; }

body {
  font-size: 100%;
  font-family: monospace, sans-serif;
  width:100%;
  background-color: #2F3242;
}
#app {
  display: flex;
  height: 125vh;
}

.sidebar {
  width: 200px;
  background-color: #a7aed2;
  padding: 20px;
}

.content {
  flex: 1;
  padding: 20px;
}
</style>