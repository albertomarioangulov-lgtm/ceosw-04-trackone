export default defineNuxtRouteMiddleware(() => {
  const { isLoggedIn } = useAuthentication()

  if (isLoggedIn.value) {
    return navigateTo('/?message=You are already logged in')
  }
})
