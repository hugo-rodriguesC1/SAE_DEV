<script setup>
</script>

<template>
  <div class="page">
    <div class="firstline">
      <div class="firstline__content">
        <p><span></span>WATCH</p>
      </div>
      <div class="firstline__content">
        <p>3D VIEWER</p>
      </div>
      <div class="firstline__content">
        <RouterLink to="/login">LOGIN</RouterLink>
      </div>
    </div>
    <div class="hero">
      <div class="hero__title">START</div>
      <div class="hero__title">CREATING</div>
      <div class="hero__title">YOUR</div>
      <div class="hero__title">WATCH</div>
    </div>
    <div class="credit">
      <div class="credit__content">This site is for education purpose only / Developed and designed by <a href="hrodrigues.fr">Hugo Rodrigues</a></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.page {
  background-color: $primary-color;
  color: $secondary-color;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.firstline{
  display: flex;
  width: 100vw;
  justify-content: space-between;
  border-bottom: 1px solid $secondary-color;
  &__content {
    display: flex;
    width: fit-content;
    height: rem(20);
    padding: rem(10);
    &:nth-child(3) {
      border-left: 1px solid $secondary-color;   
      a {
        color: $secondary-color; 
      }
      &:hover {
        background-color: $secondary-color;
        color: $primary-color;
        a {
          color: $primary-color; 
        }
      }
    }

  }
}

.hero {
  font-size: rem(160);
  line-height: rem(145);
  width: fit-content;
  padding: rem(10);
  border-bottom: 1px solid $secondary-color;
  border-right: 1px solid $secondary-color;
}

.credit {
  padding: rem(15);
  text-align: center;
  font-size: rem(18);
  a {
    color: $secondary-color;
    &:hover{
      background-color: $secondary-color;
      color: $primary-color;
    }
  }
}

</style>