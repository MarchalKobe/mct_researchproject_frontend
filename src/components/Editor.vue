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
    import EditorNavigation from '../types/EditorNavigation';

    const props = defineProps({
        code: Object as () => Languages | null,
        startcode: Object as () => Languages | null,
        editorNavigation: Object as () => EditorNavigation,
        user: Object as () => UserState,
    });

    // const tab = ref<string>('code');
    // const language = ref<string>('html');

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
        editor.setValue(props[props.editorNavigation!.tab][props.editorNavigation!.language]);

        editor.onDidChangeModelContent(useDebounceFn(() => {
            // @ts-ignore
            props[props.editorNavigation!.tab][props.editorNavigation!.language] = editor.getValue();
        }, 500));
    });

    onUnmounted(() => {
        editor?.dispose();
    });

    watch(() => props.editorNavigation!.tab, () => {
        // @ts-ignore
        editor.setValue(props[props.editorNavigation!.tab][props.editorNavigation!.language]);
        editor.focus();
    });

    watch(() => props.editorNavigation!.language, () => {
        monaco.editor.setModelLanguage(editor.getModel()!, props.editorNavigation!.language);

        // @ts-ignore
        editor.setValue(props[props.editorNavigation!.tab][props.editorNavigation!.language]);
        editor.focus();
    });
</script>

<template>
    <section class="c-editor__container">
        <div class="c-editor__navbar">
            <div v-if="props.code && props.startcode" class="u-margin-bottom-sm">
                <button class="c-button__header" :class="{ 'c-button__header-selected': props.editorNavigation!.tab === 'code' }" @click="props.editorNavigation!.tab = 'code'">Assignment</button>
                <button class="c-button__header" :class="{ 'c-button__header-selected': props.editorNavigation!.tab === 'startcode' }" @click="props.editorNavigation!.tab = 'startcode'">Startcode (not required)</button>
            </div>
            <div>
                <button v-if="(props.editorNavigation!.tab === 'code' && Object.keys(props.code!).includes('html')) || (props.editorNavigation!.tab === 'startcode' && Object.keys(props.startcode!).includes('html'))" class="c-button__header" :class="{ 'c-button__header-selected': props.editorNavigation!.language === 'html' }" @click="props.editorNavigation!.language = 'html'">index.html</button>
                <button v-if="(props.editorNavigation!.tab === 'code' && Object.keys(props.code!).includes('css')) || (props.editorNavigation!.tab === 'startcode' && Object.keys(props.startcode!).includes('css'))" class="c-button__header" :class="{ 'c-button__header-selected': props.editorNavigation!.language === 'css' }" @click="props.editorNavigation!.language = 'css'">style.css</button>
                <button v-if="(props.editorNavigation!.tab === 'code' && Object.keys(props.code!).includes('javascript')) || (props.editorNavigation!.tab === 'startcode' && Object.keys(props.startcode!).includes('javascript'))" class="c-button__header" :class="{ 'c-button__header-selected': props.editorNavigation!.language === 'javascript' }" @click="props.editorNavigation!.language = 'javascript'">javascript.js</button>
            </div>
        </div>
        <div class="c-editor">
            <div ref="editorcontainer" style="height: 100%;"></div>
        </div>
    </section>
</template>
