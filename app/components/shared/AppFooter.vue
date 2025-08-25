<template>
  <v-footer app>
    <v-col align="center" justify="center" class="text-center py-0">
      <div d-flex align-center justify-center>
        <span>©
          <!-- 2023 -  -->
          {{ new Date().getFullYear() }} - 
          <a href="https://www.softwareapm.com" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;">
            Software APM
            <!-- <img src="../assets/logo-apm.svg" alt="Software APM Logo" height="18" style="vertical-align:middle;margin-right:6px;" /> -->
            <NuxtImg height="18" src="/images/logo-apm.svg" class="mx-2" style="vertical-align:middle;" />
          </a>
        </span>
      </div>
    </v-col>
  </v-footer>
</template>