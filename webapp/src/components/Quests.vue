<template>
  <v-container v-if="quests.length > 0">
    <v-container fluid grid-list-md class="pt-1">
      <v-layout row wrap>
        <v-flex d-flex xs12 sm6 md4 lg3 xl2 v-for="quest in quests" v-bind:key="`quest-${quest.questId}`">
          <v-hover v-slot:default="{ hover }">
            <v-card width="100%"
                    elevation="4"
                    v-on:click="$emit('pinQuest', quest.questId)"
                    :class="{ 'on-hover': hover }">
              <div :class="{'pinned': pins}"></div>
              <v-list-item class="pa-0"
                           :title="quest.name + '\n' + quest.description">
                <v-list-item-avatar tile size="48" class="my-0 mb-1">
                  <v-img :src="`https://bungie.net${quest.icon}`"></v-img>
                </v-list-item-avatar>
                <v-list-item-content class="py-0">
                  <v-list-item-title class="small-headline mb-0">
                    <small>
                      {{ quest.name }}
                    </small>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <small>
                      {{ quest.description }}
                    </small>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-card-text class="pa-0">
                <v-progress-linear
                    height="20"
                    v-for="objective in quest.objectives"
                    v-bind:key="`obj-${objective.objectiveId}`"
                    :value="(objective.progress / objective.completionValue) * 100"
                    :color='objective.progress >= objective.completionValue ? "yellow darken-3" : "green"'
                >
                  <template v-slot="{ value }">
                    <v-row>
                      <v-col cols="8" class="py-0 pr-2 pl-4">
                        <small class="overflow-hidden">
                    <span class="d2-font" v-if="hasSymbol(objective.progressDescription)">
                        {{ mapSymbol(objective.progressDescription) }}
                    </span>
                          {{ cleanProgressDescription(objective.progressDescription) }}
                        </small>
                      </v-col>
                      <v-col cols="4" class="py-0 pl-2 pr-4">
                        <div class="text-right overflow-hidden">
                          <small>
                            {{ objective.progress }} / {{ objective.completionValue }}
                          </small>
                        </div>
                      </v-col>
                    </v-row>
                  </template>
                </v-progress-linear>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
  <v-container v-else>No quests</v-container>
</template>

<script>
import {PROGRESS_DESC_SYMBOLS} from "@/formatting";

export default {
  name: "Quests",
  props: {
    quests: null,
    pins: false
  },
  data: () => ({
    symbolMap: PROGRESS_DESC_SYMBOLS,
  }),
  methods: {
    cleanProgressDescription(description) {
      const subDesc = this.substringProgressDescription(description);
      if (subDesc in this.symbolMap) {
        return description.replace(/\[.*]/, "");
      }
      return description;
    },
    substringProgressDescription(description) {
      return description.substring(
          description.lastIndexOf("[") + 1,
          description.lastIndexOf("]")
      );
    },
    hasSymbol(description) {
      const subDesc = this.substringProgressDescription(description);
      return subDesc in this.symbolMap;
    },
    mapSymbol(description) {
      const subDesc = this.substringProgressDescription(description);
      if (subDesc in this.symbolMap) {
        return this.symbolMap[subDesc];
      }
      return ""
    },
  }
}
</script>

<style scoped>
.v-card .on-hover {
  background-color: #343434;
}
</style>