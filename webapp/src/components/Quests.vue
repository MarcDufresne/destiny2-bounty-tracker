<template>
  <v-container v-if="this.quests.length > 0">
    <v-card v-for="quest in this.quests" v-bind:key="`quest-${quest.questId}`">
      <img :src="`https://bungie.net${quest.icon}`" alt="" width="48px">
      {{quest.name}}
      <br>
      {{quest.description}}
      <br>
      {{quest.objectives}}
    </v-card>
  </v-container>
  <v-container v-else>No quests</v-container>
</template>

<script>
export default {
  name: "Quests",
  props: ["quests"]
}
</script>

<style scoped>

</style>