<template>
  <q-page class="flex flex-center">
    <q-input
      style="width: 600px; margin-top: 15px; margin-bottom: 15px"
      standout
      bottom-slots
      v-model="text"
      label="Search for token name, symbol, or contract address"
      counter
      maxlength="120"
      :disabled="this.disabled"
      :loading="this.loadingState"
      @keydown.enter.prevent="search(text)"
      lazy-rules
      :rules="[ val => val && val.length > 0 || 'Please enter a search term']"
    >

      <template v-slot:append>
        <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer icon" />
        <q-icon name="search" @click="search(text)" class="icon" />
      </template>

    </q-input>
    <div v-if="this.searchResults.length > 0" class="q-pa-md">
      <q-btn-dropdown
        split
        class="glossy"
        color="teal"
        label="Sort By"
        >
        <q-list>
          <q-item clickable v-close-popup @click="this.sort(1)">Token Name (A-Z)</q-item>
          <q-item clickable v-close-popup @click="this.sort(2)">Token Symbol (A-Z)</q-item>
          <q-item clickable v-close-popup @click="this.sort(3)">Score (Descending)</q-item>
          <q-item clickable v-close-popup @click="this.sort(4)">Score (Ascending)</q-item>
          <q-item clickable v-close-popup @click="this.sort(5)">Last Updated (New-Old)</q-item>
          <q-item clickable v-close-popup @click="this.sort(6)">Last Updated (Old-New)</q-item>

        </q-list>
      </q-btn-dropdown>
    </div>
    <section style="width: 80%; margin-bottom: 15px" v-bind:key="index" v-for="(token, index) in this.searchResults">
      <div class="q-card" style="padding: 15px">
        <div class="row">
          <p><strong>Token Name:</strong> {{token.token_name}}</p>
        </div>
        <div class="row">
          <p><strong>Token Symbol:</strong> {{token.token_symbol}}</p>
        </div>
        <div class="row">
          <p><strong>Contract Address:</strong> <a :href="`https://bscscan.com/token/${token.contract_address}`" target="_blank">{{token.contract_address}}</a></p>
        </div>
        <div class="row">
          <p>
            <strong>Confidence Score: </strong>
            <strong
            :class="token.confident_score > 60 ? 'green' :
            (token.confident_score >= 35 ? 'orange' : 'red')">
              {{token.confident_score}}
            </strong>
          </p>
        </div>
        <div v-if="token.final_verdict_by_emoji !== ''" class="row">
          <p><strong>Confidence Emoji:</strong> {{token.final_verdict_by_emoji}}</p>
        </div>
        <div class="row">
          <p><strong>Final Verdict:</strong> {{token.final_verdict}}</p>
        </div>
        <div class="row">
          <p><strong>Last Updated:</strong> {{new Date(token.updated_at).toLocaleDateString("en-US")}}</p>
        </div>
      </div>
    </section>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
const {results} = require('../../results.json');

export default defineComponent({
  name: 'PageIndex',
  data() {
    return {
      text: '',
      disabled: false,
      loadingState: false,
      searchResults: []
    }
  },
  methods: {
    search(query) {
      if(query === '') {
        return;
      }
      this.disabled = true;
      this.loadingState = true;
      this.searchResults = [];
      for(let token in results) {
        if(results[token].token_name?.toLowerCase().includes(query.toLowerCase()) ||
            results[token].token_symbol?.toLowerCase().includes(query.toLowerCase()) ||
            results[token].contract_address?.toLowerCase().includes(query.toLowerCase())) {
          this.searchResults.push(results[token]);
        }
      }
      this.disabled = false;
      this.loadingState = false;
    },
    sort(method) {
      switch (method) {
        case 1:
          this.searchResults.sort((a, b) => (a.token_name?.toLowerCase().trim() > b.token_name?.toLowerCase().trim()) ? 1 : -1);
          break;

        case 2:
          this.searchResults.sort((a, b) => (a.token_symbol?.toLowerCase().trim() > b.token_symbol?.toLowerCase().trim()) ? 1 : -1);
          break;

        case 3:
          this.searchResults.sort((a, b) => (a.confident_score < b.confident_score) ? 1 : -1);
          break;

        case 4:
          this.searchResults.sort((a, b) => (a.confident_score > b.confident_score) ? 1 : -1);
          break;

        case 5:
          this.searchResults.sort((a, b) => (a.updated_at < b.updated_at) ? 1 : -1);
          break;

        case 6:
          this.searchResults.sort((a, b) => (a.updated_at > b.updated_at) ? 1 : -1);
          break;
      }
    }
  }
})
</script>
<style>
  .green {
    color: #21BA45;
  }

  .orange {
    color: #F2C037;
  }

  .red {
    color: red;
  }

  .icon:hover {
    cursor: pointer;
  }
</style>
