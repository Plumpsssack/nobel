import Vue from "vue";

const faFilter = value => {
    if (!value) {
        return null;
    }
    const parts = value.split(" ");

    if (parts.length > 0) {
        if (parts.length > 1) {
            return [parts[0], parts[1].replace("fa-", "")];
        }
        return parts[0].replace("fa-", "");
    }

    return value;
};
Vue.filter("fa", faFilter);
