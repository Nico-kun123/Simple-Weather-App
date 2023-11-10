<script setup>
import Weather from "./components/WeatherStuff.vue";
</script>

<template>
  <header>
    <div class="wrapper">
      <header>
        <div class="logo" style="width: fit-content; background-color: antiquewhite; border-radius: 25%;">
          <img
            alt="Vue logo"
            style="padding: 15px; padding-top: 25px;"
            src="./assets/logo.svg"
            width="125"
            height="125"
          />
        </div>
      </header>

      <Weather />
    </div>
  </header>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  animation: app-logo-spin infinite 20s linear;
  display: block;
  margin: 0 auto 2rem;
}
</style>
