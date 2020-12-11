<template>
  <v-list-item :title="objective.name + '\n' + objective.description">
    <v-list-item-avatar tile size="128">
      <v-img :src="`https://bungie.net${objective.icon}`"></v-img>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>
        {{ objective.name }}
      </v-list-item-title>
      <v-list-item-subtitle>
        {{objective.description}}
        <br>
        {{objective.type}}
        <br>
        {{objective.objectiveDescription}}
        <br>
        <br>
        <pre>{{objective.objectiveId}} | {{objective.invType}}</pre>
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: "MappingDebuggerObjective",
  props: {
    objective: null
  }
}
</script>

<style scoped>

</style>
