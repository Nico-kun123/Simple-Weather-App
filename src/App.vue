<script setup>
import Weather from "./components/WeatherStuff.vue";
</script>

<template>
  <header>
    <div class="wrapper">
      <header>
        <div class="logo">
          <img alt="Vue logo" src="./assets/logo.svg" width="50" height="50" />
        </div>
      </header>

      <Weather />
    </div>
  </header>
</template>

<style lang="scss">
.separator {
  border-bottom-width: 3px;
  border-bottom-color: #000;
  border-bottom-style: double;
  margin: 1em 0;
  width: 100%;
}

header {
  line-height: 1.5;
}

h1 {
  font-weight: bolder;
}

h2 {
  font-weight: bold;
}
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 1em auto;

  background-color: antiquewhite;
  border-radius: 25%;

  width: 5em;
  height: 5em;

  & img {
    width: 4em;
    height: max-content;
  }
}
</style>
