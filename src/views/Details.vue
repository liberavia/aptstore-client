<template>
    <main role="main" class="container fadeIn4">
        <div class="row">
            <div class="col-sm-6">
                <div id="app_details_mainicon_box">
                    <img id="app_details_mainicon" src="https://steamcdn-a.akamaihd.net/steam/apps/544730/header.jpg">
                </div>
            </div>
            <div class="col-sm-6">
                <div class="row align-items-start">
                    <div class="col-sm-6 align-self-end">
                        <h1>App name</h1>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6 align-self-start">
                        <span class="badge rounded-pill bg-primary">Category</span>
                    </div>
                    <div class="col-sm-4 align-self-end">
                        <span class="fa fa-star checked"></span>
                        <span class="fa fa-star checked"></span>
                        <span class="fa fa-star checked"></span>
                        <span class="fa fa-star"></span>
                        <span class="fa fa-star"></span>
                    </div>
                </div>
                <div class="row">
                    <div id="age_recommendation" class="col align-self-end">
                        <img id="usk" class="usk_default" src="https://usk.de/wp-content/themes/neve-child/images/Assets/Icon/USK/16j.png">
                    </div>
                </div>
                <div class="row align-items-end">
                    <div class="col align-self-end">
                        <div class="row">
                            <div class="col">
                                <select class="form-select" aria-label="Default select example">
                                    <option selected>Proton</option>
                                </select>
                            </div>
                            <div class="col">
                                <button type="button" class="btn btn-success">Install</button>
                                <button type="button" class="btn btn-danger">Remove</button>
                                <button type="button" class="btn btn-primary">Launch</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
export default {
    name: 'Details',
}
</script>

<style scoped>

</style>