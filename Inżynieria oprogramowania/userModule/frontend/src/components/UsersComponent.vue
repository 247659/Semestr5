<template>
    <div class = "container">
        <h1 class="text-center"> UserList</h1>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>pesel</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for = "user in users" v-bind:key="user.username">
                    <td> {{ user.username }}</td>
                    <td> {{ user.name }}</td>
                    <td> {{ user.surname }}</td>
                    <td> {{ user.pesel }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import UserService from '@/services/UserService';
    export default {
        name: 'UsersComponent',
        data() {
            return {
                users : []
            }
            
        },
        methods: {
            getUsers() {
                UserService.getUsers().then((response) => {
                    this.users = response.data;
                });
            }
        },
        created() {
            this.getUsers()
        }
    }
</script>

<style>
</style>