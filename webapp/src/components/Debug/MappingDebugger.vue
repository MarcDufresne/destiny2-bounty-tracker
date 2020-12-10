<script src="../../formatting.js"></script>
<template>
  <v-container>
    <v-window v-model="mappingStep">
      <v-window-item v-for="(obj, index) in this.unmappedObjectives" v-bind:key="`obj-${index}`" :step="index + 1">
        <v-card>
          <v-row align="center" class="pl-2">
            <v-col cols="6">
              <v-btn block @click="mappingStep = index - 1" :disabled="mappingStep <= 0">
                Previous
              </v-btn>
            </v-col>
            <v-col cols="6" class="pr-6">
              <v-btn block @click="mappingStep = index + 1" :disabled="mappingStep > unmappedObjectives.length">
                Next
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <MappingDebuggerObjective :objective="obj"/>
            </v-col>
            <v-col cols="3">
              <v-radio-group v-model="obj.activityType">
                <v-radio v-for="activity in activityTypes" :key="activity" :label="activity"
                         :value="activity"></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="3">
              <v-radio-group v-model="obj.objectiveType">
                <v-radio v-for="objType in objectiveTypes" :key="objType" :label="objType"
                         :value="objType"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-card>
      </v-window-item>
    </v-window>
    <v-textarea
        readonly outlined
        :value="formatObjectives()"
        id="formattedObjectives"
        append-outer-icon="mdi-clipboard"
        @click:append-outer="copyFormattedObjectivesToClipboard"
    ></v-textarea>
  </v-container>
</template>

<script>
import {DevUtils} from "@/devUtils";
import MappingDebuggerObjective from "@/components/Debug/MappingDebuggerObjective";
import {AbilityType, ActivityType, DamageType, DestinationType, EnemyType, WeaponType} from "@/models";

export default {
  name: "MappingDebugger",
  components: {MappingDebuggerObjective},
  props: {},
  data: () => ({
    mappingStep: 1,
    formattedObjectives: "",
    unmappedObjectives: null,
    activityTypes: [],
    objectiveTypes: [],
  }),
  methods: {
    findUnmappedObjectives() {
      this.unmappedObjectives = DevUtils.findUnmappedObjectives();
    },
    formatObjectives() {
      let formattedObjectives = "";
      for (const objectiveIndex in this.unmappedObjectives) {
        const obj = this.unmappedObjectives[objectiveIndex];
        if (obj.activityType !== undefined && obj.objectiveType !== undefined) {
          formattedObjectives +=
              `"${obj.objectiveId}": Models.ObjectiveMapping(${obj.activityType}, ${obj.objectiveType}),  // ${obj.invType}\n`;
        }
      }
      return formattedObjectives;
    },
    copyFormattedObjectivesToClipboard() {
      /* Get the text field */
      const copyText = document.getElementById("formattedObjectives");
      copyText.select();
      document.execCommand("copy");
      window.getSelection().removeAllRanges()
    },
    formatActivityTypes() {
      let activityTypes = []
      for (const act in ActivityType) {
        activityTypes.push(`ActivityType.${act}`)
      }
      for (const dest in DestinationType) {
        activityTypes.push(`DestinationType.${dest}`)
      }
      this.activityTypes = activityTypes;
    },
    formatObjectiveTypes() {
      let objTypes = []
      objTypes.push("null");
      for (const weapon in WeaponType) {
        objTypes.push(`WeaponType.${weapon}`)
      }
      for (const damage in DamageType) {
        objTypes.push(`DamageType.${damage}`)
      }
      for (const ability in AbilityType) {
        objTypes.push(`AbilityType.${ability}`)
      }
      for (const enemy in EnemyType) {
        objTypes.push(`EnemyType.${enemy}`)
      }
      this.objectiveTypes = objTypes;
    }
  },
  mounted() {
    this.findUnmappedObjectives();
    this.formatActivityTypes();
    this.formatObjectiveTypes();
  }
}
</script>

<style scoped>
</style>
