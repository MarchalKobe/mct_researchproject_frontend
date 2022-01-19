<script setup lang="ts">
    import * as monaco from 'monaco-editor';
    import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
    import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
    import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
    import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
    import { onMounted, onUnmounted, ref, watch } from 'vue';
    import { useDebounceFn } from '@vueuse/core';
    import Languages from '../types/Languages';
    import { UserState } from '../store/modules/user';

    const props = defineProps({
        code: Object as () => Languages | null,
        startcode: Object as () => Languages | null,
        user: Object as () => UserState,
    });

    const tab = ref<string>('code');
    const language = ref<string>('html');

    // @ts-ignore
    self.MonacoEnvironment = {
        getWorker(_: string, label: string) {
            if (label === 'html') {
                return new htmlWorker();
            } else if (label === 'css') {
                return new cssWorker();
            } else if (label === 'typescript' || label === 'javascript') {
                return new tsWorker();
            };

            return new editorWorker();
        },
    };

    const editorcontainer = ref<HTMLDivElement | null>(null);

    let editor: monaco.editor.IStandaloneCodeEditor;

    onMounted(() => {
        editor = monaco.editor.create(editorcontainer.value!, {
            language: 'html',
            theme: props.user!.preferredTheme === 'dark' ? 'vs-dark' : 'vs',
        });

        // @ts-ignore
        editor.setValue(props[tab.value][language.value]);

        editor.onDidChangeModelContent(useDebounceFn(() => {
            // @ts-ignore
            props[tab.value][language.value] = editor.getValue();
        }, 500));
    });

    onUnmounted(() => {
        editor?.dispose();
    });

    watch(() => tab.value, () => {
        // @ts-ignore
        editor.setValue(props[tab.value][language.value]);
        editor.focus();
    });

    watch(() => language.value, () => {
        monaco.editor.setModelLanguage(editor.getModel()!, language.value);

        // @ts-ignore
        editor.setValue(props[tab.value][language.value]);
        editor.focus();
    });
</script>

<template>
    <section class="c-editor__container">
        <div class="c-editor__navbar">
            <div v-if="props.code && props.startcode" class="u-margin-bottom-sm">
                <button class="c-editor__button" :class="{ 'c-editor__button-selected': tab === 'code' }" @click="tab = 'code'">Assignment</button>
                <button class="c-editor__button" :class="{ 'c-editor__button-selected': tab === 'startcode' }" @click="tab = 'startcode'">Startcode (not required)</button>
            </div>
            <div>
                <button v-if="(tab === 'code' && Object.keys(props.code!).includes('html')) || tab === 'startcode'" class="c-editor__button" :class="{ 'c-editor__button-selected': language === 'html' }" @click="language = 'html'">index.html</button>
                <button v-if="(tab === 'code' && Object.keys(props.code!).includes('css')) || tab === 'startcode'" class="c-editor__button" :class="{ 'c-editor__button-selected': language === 'css' }" @click="language = 'css'">style.css</button>
                <button v-if="(tab === 'code' && Object.keys(props.code!).includes('javascript')) || tab === 'startcode'" class="c-editor__button" :class="{ 'c-editor__button-selected': language === 'javascript' }" @click="language = 'javascript'">javascript.js</button>
            </div>
        </div>
        <div class="c-editor">
            <div ref="editorcontainer" style="height: 100%;"></div>
        </div>
    </section>
</template>
