import components from "./components";

for (const item of Object.keys(components)) {
    Vue.component(item, components[item])
}
