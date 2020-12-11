<template>
  <v-container fluid v-if="Object.keys(objectives).length > 0">
    <v-row>
      <v-container class="pa-0" v-if="pinnedObjectiveIDs.length > 0">
        <v-container fluid grid-list-md class="pa-0">
          <v-layout row wrap>
            <v-col cols="1" class="pr-0">
              <span>Pinned</span>
            </v-col>
            <v-col cols="11" class="pl-1">
              <ObjectivesCategory
                  :objectives="objectivesFromIDs(pinnedObjectiveIDs)"
                  :selectedActivityFilters="selectedActivityFilters"
                  :showCompletedObjectives="showCompletedObjectives"
                  v-on:pinObjective="unpinObjective($event)"
                  :pins="true"
              />
            </v-col>
          </v-layout>
        </v-container>
      </v-container>
      <v-container v-for="(category_objectives, category_name) in objectives"
                   v-bind:key="category_name"
                   class="pa-0"
      >
        <div v-if="countShownObjectives(category_objectives) > 0">
          <v-container fluid grid-list-md class="pa-0">
            <v-layout row wrap>
              <v-col cols="1" class="pr-0">
                <span>{{ formatName(category_name) }}</span>
              </v-col>
              <v-col cols="11" class="pl-1">
                <ObjectivesCategory
                    :objectives="category_objectives"
                    :selectedActivityFilters="selectedActivityFilters"
                    :showCompletedObjectives="showCompletedObjectives"
                    v-on:pinObjective="pinObjective($event)"
                />
              </v-col>
            </v-layout>
          </v-container>
        </div>
      </v-container>
    </v-row>
  </v-container>
  <v-container v-else>
    <div class="text-center">No objectives available!</div>
  </v-container>
</template>

<script>
import ObjectivesCategory from "./ObjectivesCategory";
import {OBJECTIVE_TYPES_FORMAT} from "@/formatting";

export default {
  name: "CharacterObjectives",
  components: {ObjectivesCategory},
  props: ["objectives", "selectedActivityFilters", "showCompletedObjectives"],
  data: () => ({
    formattedNames: OBJECTIVE_TYPES_FORMAT,
    pinnedObjectiveIDs: []
  }),
  methods: {
    formatName(rawName) {
      if (rawName in this.formattedNames) {
        return this.formattedNames[rawName];
      }
      return rawName;
    },
    countShownObjectives(categoryObjectives) {
      let count = 0;
      for (const objIndex in categoryObjectives) {
        const objective = categoryObjectives[objIndex];
        if ((objective.activity == null)
            || (this.selectedActivityFilters.includes(objective.activity) && this.showCompletedObjectives)
            || (this.selectedActivityFilters.includes(objective.activity) && !this.showCompletedObjectives && objective.progress < objective.completionValue)
        ) {
          count += 1;
        }
      }
      return count;
    },
    pinObjective(objectiveId) {
      const index = this.pinnedObjectiveIDs.indexOf(objectiveId);
      if (index < 0) {
        this.pinnedObjectiveIDs.push(objectiveId);
      }
    },
    unpinObjective(objectiveId) {
      const index = this.pinnedObjectiveIDs.indexOf(objectiveId);
      if (index > -1) {
        this.pinnedObjectiveIDs.splice(index, 1);
      }
    },
    findObjectiveByID(objectiveId) {
      for (let [categoryName, categoryObjectives] of Object.entries(this.objectives)) {
        for (const objectiveIndex in categoryObjectives) {
          if (categoryObjectives[objectiveIndex].objectiveId === objectiveId) {
            console.log(categoryObjectives[objectiveIndex].objectiveId);
            return categoryObjectives[objectiveIndex];
          }
        }
      }
      this.unpinObjective(objectiveId);
      return false;
    },
    objectivesFromIDs(objectiveIDs) {
      let fullObjectives = []
      for (const objIdIndex in objectiveIDs) {
        const objectiveFromID = this.findObjectiveByID(objectiveIDs[objIdIndex]);
        if (objectiveFromID !== false) {
          fullObjectives.push(objectiveFromID);
        }
      }
      console.log(fullObjectives);
      return fullObjectives;
    }
  }
}
</script>

<style scoped>

</style>
