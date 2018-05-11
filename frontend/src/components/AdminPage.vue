<template>
    <div>
        {{datas}}
    </div>
</template>

<script>
export default {
    created() {
        this.$http.get('/api/v1/examples')
        .then((response) => {
            this.datas = response.data
        })
    },
    data() {
        return {
            datas : []
        }
    }
};
</script>

<style scoped>

</style>
