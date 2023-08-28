<template>
    <Vue3EasyDataTable header-class-name="customize-header" :headers="headers" :items="items" alternating border-cell
        hide-footer>
        <template #header="header">
            <div class="text-sm font-medium">
                {{ header.text.charAt(0).toUpperCase() + header.text.slice(1) }}
            </div>
        </template>
        <template #item-name="{ name, _href }">
            <RouterLink class="text-blue-700 hover:underline" :to="_href">{{ name
            }}</RouterLink>
        </template>
    </Vue3EasyDataTable>
</template>

<script setup>
import { computed } from 'vue'
import Vue3EasyDataTable from 'vue3-easy-data-table'

const props = defineProps({
    data: { type: Object, required: true },
})

const headers = computed(() => {
    const attrs = new Set()
    const rows = props.data
    if (rows) {
        rows.forEach(row => {
            Object.keys(row).forEach(key => {
                if (!key.startsWith('_')) {
                    attrs.add(key)
                }
            })
        })
        attrs.delete('id')
        console.log('attrs = ', attrs)
    }
    return Array.from(attrs).map(value => {
        return {
            text: value,
            value
        }
    })
})

const items = computed(() => {
    return props.data || []
})



// const headers = ref([
// { text: "PLAYER", value: "player" },
// { text: "TEAM", value: "team" },
// { text: "NUMBER", value: "number" },
// { text: "POSITION", value: "position" },
// { text: "HEIGHT", value: "indicator.height" },
// { text: "WEIGHT (lbs)", value: "indicator.weight", sortable: true },
// { text: "LAST ATTENDED", value: "lastAttended", width: 200 },
// { text: "COUNTRY", value: "country" },
// ])

// const items = ref([
// { player: "Stephen Curry", team: "GSW", number: 30, position: 'G', indicator: { "height": '6-2', "weight": 185 }, lastAttended: "Davidson", country: "USA" },
// { player: "Lebron James", team: "LAL", number: 6, position: 'F', indicator: { "height": '6-9', "weight": 250 }, lastAttended: "St. Vincent-St. Mary HS (OH)", country: "USA" },
// { player: "Kevin Durant", team: "BKN", number: 7, position: 'F', indicator: { "height": '6-10', "weight": 240 }, lastAttended: "Texas-Austin", country: "USA" },
// { player: "Giannis Antetokounmpo", team: "MIL", number: 34, position: 'F', indicator: { "height": '6-11', "weight": 242 }, lastAttended: "Filathlitikos", country: "Greece" },
// ]);

</script>


<style>
.customize-header {
    --easy-table-header-background-color: #efefef;
}
</style>
