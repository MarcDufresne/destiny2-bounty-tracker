<template>
  <div v-if="Object.keys(this.objectives).length > 0">
    <v-item-group v-model="tab_model">
      <v-container class="pt-0 pb-0">
        <v-row align-content="center">
          <v-col
              v-for="(objectives, char_name, index) in this.objectives"
              :key="`btn-${index}`"
              cols="12"
              sm="4">
            <v-item>
              <v-card
                  @click="tab_model = index"
                  class="ma-0 char-info"
                  :style="`background-image: url('https://bungie.net${charInfo[char_name].emblem}');`"
              >
                <div :class="{'active': tab_model === index}"></div>
                <div
                    class="ma-0 pl-12">
                  <span class="char-class pl-1">
                    {{ charInfo[char_name].class }}
                  </span>
                  <span class="float-right char-light pr-2 yellow--text">
                    <span class="d2-font"></span><b>{{ charInfo[char_name].light }}</b>
                  </span>
                  <br>
                  <span class="char-race pl-1">
                    {{ charInfo[char_name].gender }} {{ charInfo[char_name].race }}
                  </span>
                </div>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>
    <v-window v-model="tab_model">
      <v-window-item
          v-for="(objectives, char_name, index) in this.objectives"
          :key="`window-${index}`"
          :value="index"
      >
        <v-card flat>
          <v-card-text class="pa-0">
            <CharacterObjectives
                :objectives="objectives"
                :selectedActivityFilters="selectedActivityFilters"
                :showCompletedObjectives="showCompletedObjectives"
            />
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
  </div>
  <div v-else>
    <v-container>
      <v-row align="center" justify="center" class="pt-4">
        <v-progress-circular indeterminate color="indigo"></v-progress-circular>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import {Client} from "@/client";
import {LocalStorage, LOCAL_STORAGE_ACCESS_TOKEN_KEY} from "@/utils";
import CharacterObjectives from "./CharacterObjectives";

export default {
  name: "Bounties",
  components: {CharacterObjectives},
  props: {
    accessToken: String,
    autoRefresh: Boolean,
    selectedActivityFilters: Array,
    showCompletedObjectives: Boolean,
  },
  data: () => ({
    tab_model: null,
    objectives: {},
    charInfo: {},
  }),
  async mounted() {
    await this.getObjectives();
  },
  watch: {
    autoRefresh: function(newValue, _) {
      if (newValue) {
        this.getObjectives();
        this.autoRefreshRef = setInterval(this.interval, 5000);
      } else {
        clearInterval(this.autoRefreshRef);
      }
    }
  },
  methods: {
    async getObjectives() {
      const accessToken = LocalStorage.getToken(LOCAL_STORAGE_ACCESS_TOKEN_KEY);

      const newObjectives = await Client.getObjectives(accessToken.token);
      if (newObjectives !== false) {
        this.objectives = newObjectives[0];
        this.$emit('objectiveUpdate', newObjectives[1]);
        this.charInfo = newObjectives[2];
      }
    },
    async interval() {
      await this.getObjectives();
    }
  },
}
</script>

<style scoped>
.char-info {
  background-size: cover;
  width: 276px;
}
.char-class {
  font-size: larger;
}
.char-race {
  font-size: smaller;
}
.active {
    position: absolute;
    left: 0;
    top: 0;
    width: 16px;
    height: 16px;
    float: start;
    clip-path: polygon(100% 0, 0 100%, 0 0);
    background-color: #f9a825;
}
</style>
