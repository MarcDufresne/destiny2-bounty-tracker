<template>
 <v-container>
  <v-text-field
      readonly outlined
      v-model="formattedObjectives"
      id="formattedObjectives"
      append-outer-icon="mdi-clipboard"
      @click:append-outer="copyFormattedObjectivesToClipboard"
  ></v-text-field>
 </v-container>
</template>

<script>
  import {DevUtils} from "@/devUtils";

  export default {
    name: "MappingDebugger",
    props: {
        unmappedObjectives: null
    },
    data: () => ({
        formattedObjectives: "THISIS A TEST"
    }),
    methods: {
      findUnmappedObjectives() {
        this.unmappedObjectives = DevUtils.findUnmappedObjectives();
      },
      copyFormattedObjectivesToClipboard() {
        /* Get the text field */
        const copyText = document.getElementById("formattedObjectives");
        copyText.select();
        document.execCommand("copy");
        window.getSelection().removeAllRanges()
      }
    },
    mounted() {
      this.findUnmappedObjectives();
    }
  }
</script>

<style scoped>

</style>