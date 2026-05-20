<script setup lang="ts">
import { ref, onMounted } from 'vue';
import useBackground from '~/composables/useBackground';

const runConfig  = useRuntimeConfig().public
const clientLogo = ref<any>(runConfig.clientLogo)

const title = ref<string>('')

definePageMeta({
  layout: 'login',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  }
})

const { backgroundStyle } = useBackground()

</script>

<template>

  <v-container class="fill-height" fluid :style="[backgroundStyle]">
    <v-row align="center" justify="center" class="h-100">
      <v-col align="center" justify="center">
        
        <v-card theme="light" elevation="24" max-width="420">
          <!-- <DevOnly>
              <h1>Dev Mode</h1>
          </DevOnly> -->
          <div class="text-center pa-4 pt-12">

          
          <!-- <v-col cols="12" class="mt-4"> -->
              <!-- <img src="../assets/logo-min.png" height="100" class="mt-2"/> -->
              <!-- <NuxtImg src="/images/ceosw-s-logo.svg" height="100" quality="80" class="logo-anim"/> -->
              <SharedLogo height="100" />
              <template v-if="clientLogo">

              <v-card color="#20344C" class="mx-4 mo-4 ">
                <v-sheet color="#20344C" class="d-flex justify-center align-center">
                  <v-sheet color="#20344C" class="ml-0">
                    <img class="mt-2"
                      height="100"
                      src="https://tiendaredboston.com/wp-content/uploads/2023/04/SVG-ESCUDO-BIS.svg"
                    />
                  </v-sheet>
                
                  <v-sheet color="#20344C" class="ml-4" width="150">
                    <p class="logo-text text-left font-weight-medium">BOSTON INTERNATIONAL SCHOOL</p>
                  </v-sheet>
                </v-sheet>
              </v-card>
            </template>
          <!-- </v-col> -->
          </div>
          
          <v-card-text>
            <login-form />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- <LoginForm2 /> -->
  </v-container>
</template>

<style>

/* .hijo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
} */

.logo-text {
  line-height: 100%;
  font-family: sans-serif, "Helvetica Neue", "Lucida Grande", Arial, "Roboto";
  transform:scaleX(1.25) scaleY(0.8);
}

.logo-anim {
  animation: logoFadeScale 1.2s ease-out;
}

@keyframes logoFadeScale {
  0% {
    opacity: 0;
    transform: scale(0.7);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>