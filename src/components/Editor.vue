<script setup lang="ts">
    import * as monaco from 'monaco-editor';
    // import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
    import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
    import { onMounted, onUnmounted, ref, watch } from 'vue';
    import Languages from '../types/Languages';

    const props = defineProps({
        code: Object as () => Languages | null,
        startcode: Object as () => Languages | null,
    });

    // @ts-ignore
    self.MonacoEnvironment = {
        getWorker(_: string, label: string) {
            return new htmlWorker();
        },
    };

    const container = ref<HTMLDivElement | null>(null);

    let editor: monaco.editor.IStandaloneCodeEditor;

    onMounted(() => {
        editor = monaco.editor.create(container.value!, {
            language: 'html',
            theme: 'vs-dark',
        });

        editor.setValue(props.code!.html!);

        editor.onDidChangeModelContent(() => {
            props.code!.html = editor.getValue();
        });
    });

    onUnmounted(() => {
        editor?.dispose();
    });


    // watch(() => editor.getValue, () => {
    //     console.log('test');
        
    // });
</script>

<template>
    <section class="c-editor__container">
        <div class="c-editor__navbar">
            <div v-if="props.code && props.startcode" class="u-margin-bottom-sm">
                <button class="c-editor__button c-editor__button-selected">Assignment</button>
                <button class="c-editor__button">Startcode (not required)</button>
            </div>
            <div>
                <button class="c-editor__button c-editor__button-selected">index.html</button>
                <button class="c-editor__button">style.css</button>
                <button class="c-editor__button">javascript.js</button>
            </div>
        </div>
        <div class="c-editor">
            <div ref="container" style="height: 100%;"></div>
        </div>
    </section>
</template>
