<script setup lang="ts">
    const props = defineProps({
        label: String,
        symbol: String,
        type: String,
        placeholder: String,
        model: Object,
        modelName: String,
        required: Boolean as () => boolean | null,
        error: String as () => string | null,
    });
</script>

<template>
    <label class="c-input__container u-margin-bottom-x-md" :class="props.error ? 'c-input__container-error' : ''" :for="props.label">
        <span class="c-input__label">{{ props.label }}<span v-if="props.required" class="u-color-alpha">*</span></span>
        <div class="c-input">
            <svg v-if="props.symbol === 'email'" class="c-input__symbol" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <svg v-if="props.symbol === 'password'" class="c-input__symbol" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <svg v-if="props.symbol === 'user'" class="c-input__symbol" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <svg v-if="props.symbol === 'classroom'" class="c-input__symbol" xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 50 37"><path id="icons8-class" d="M2.813,8A1,1,0,0,0,2,9V38H.906A1,1,0,0,0,0,39v5a1,1,0,0,0,1,1H49a1,1,0,0,0,1-1V39a1,1,0,0,0-1-1H48V9a1,1,0,0,0-1-1H2.813ZM4,10H46V38H21.906L23,36l-1.094-2H11v4H4Zm35,4.969a1.536,1.536,0,0,0-.594.219L25.031,24.719l-5.406-4.5a1,1,0,0,0-1.219-.031l-8,6a1.006,1.006,0,0,0,1.188,1.625l7.375-5.531,5.406,4.5a1,1,0,0,0,1.219.031l14-10A1,1,0,0,0,39,14.969ZM2,40H48v3H2Z" fill="#A2A8B0"/></svg>
            <svg v-if="props.symbol === 'category'" class="c-input__symbol" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            <svg v-if="props.symbol === 'document'" class="c-input__symbol" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"/></svg>

            <input class="c-input__field" :type="props.type" :name="props.label" :id="props.label" :placeholder="props.placeholder" v-model="props.model![props.modelName!]">
        </div>

        <div v-if="props.error" class="c-input__error-container u-flex u-align-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span class="c-input__error">{{ props.error }}</span>
        </div>
    </label>
</template>
