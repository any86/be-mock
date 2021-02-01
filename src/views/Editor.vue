<template>
    <article class="p-3">
        <JSONEditor v-model="responseData"></JSONEditor>
    </article>
</template>

<script>
import JSONEditor from '@/components/JSONEditor.vue';
export default {
    name: 'Editor',

    components: { JSONEditor },

    data() {
        return { responseData: { a: 'test' } };
    },
};
</script>