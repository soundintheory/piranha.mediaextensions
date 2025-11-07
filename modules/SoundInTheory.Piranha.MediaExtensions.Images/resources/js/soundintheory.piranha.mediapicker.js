/*global
    piranha
*/

setTimeout(() => {
    piranha.mediapicker = new Vue({
        el: "#mediamanagerpicker",
        data: {
            folderName: '',
            search: "",
            listView: true,
            typeFilter: null,
            currentFolderId: null,
            parentFolderId: null,
            currentDocumentFolderId: null,
            parentDocumentFolderId: null,
            currentImageFolderId: null,
            parentImageFolderId: null,
            currentVideoFolderId: null,
            parentVideoFolderId: null,
            currentFolderBreadcrumb: null,
            filter: "",
            orderBy: 'lastModified',
            direction: "desc",
            folders: [],
            filteredFolders: [],
            items: [],
            filteredItems: [],
            folder: {
                name: null
            },
            callback: null,
            dropzone: null
        },
        methods: {
            toggle: function () {
                this.listView = !this.listView;
            },
            load: function (id) {
                var self = this;

                var url = piranha.baseUrl + "manager/api/mediamanager/list" + (id ? "/" + id : "")+"/?width=210&height=160";
                if (self.typeFilter) {
                    url += "&filter=" + self.typeFilter;
                }

                fetch(url)
                    .then(function (response) { return response.json(); })
                    .then(function (result) {
                        self.currentFolderId = result.currentFolderId;
                        self.parentFolderId = result.parentFolderId;
                        self.folders = result.folders;
                        self.items = result.media;
                        self.listView = result.viewMode === "list";
                        self.search = "";
                        self.currentFolderBreadcrumb = result.currentFolderBreadcrumb;

                        //set current folder for filter
                        if (self.typeFilter) {
                            switch (self.typeFilter.toLowerCase()) {
                                case "document":
                                    self.currentDocumentFolderId = result.currentFolderId;
                                    self.parentDocumentFolderId = result.parentFolderId;
                                    break;
                                case "image":
                                    self.currentImageFolderId = result.currentFolderId;
                                    self.parentImageFolderId = result.parentFolderId;
                                    break;
                                case "video":
                                    self.currentVideoFolderId = result.currentFolderId;
                                    self.parentVideoFolderId = result.parentFolderId;
                                    break;
                            }
                        }

                        self.sortItems()
                    })
                    .catch(function (error) { console.log("error:", error ); });
            },
            getThumbnailUrl: function (item) {
                return item.altVersionUrl !== null ? item.altVersionUrl : piranha.baseUrl + "manager/api/media/url/" + item.id + "/210/160";
            },
            refresh: function () {
                piranha.mediapicker.load(piranha.mediapicker.currentFolderId);
            },
            open: function (callback, filter, folderId) {
                this.search = '';
                this.callback = callback;
                this.typeFilter = filter;

                this.load(folderId);

                $("#mediamanagerpicker").modal("show");
            },
            openCurrentFolder: function (callback, filter) {
                this.callback = callback;
                this.typeFilter = filter;

                var folderId = this.currentFolderId;
                if (filter) {
                    switch (filter.toLowerCase()) {
                        case "document":
                            folderId = this.currentDocumentFolderId? this.currentDocumentFolderId : folderId;
                            break;
                        case "image":
                            folderId = this.currentImageFolderId ? this.currentImageFolderId : folderId;
                            break;
                        case "video":
                            folderId = this.currentVideoFolderId ? this.currentVideoFolderId : folderId;
                            break;
                    }
                }
                
                this.load(folderId);

                $("#mediamanagerpicker").modal("show");
            },
            onEnter: function () {
                if (this.filteredItems.length === 0 && this.filteredFolders.length === 1) {
                    this.load(this.filteredFolders[0].id);
                    this.search = "";
                }

                if (this.filteredItems.length === 1 && this.filteredFolders.length === 0) {
                    this.select(this.filteredItems[0]);
                }
            },
            select: function (item) {
                this.callback(JSON.parse(JSON.stringify(item)));
                this.callback = null;
                this.search = "";

                $("#mediamanagerpicker").modal("hide");
            },
            savefolder: function () {
                var self = this;

                if (self.folderName !== "") {
                    fetch(piranha.baseUrl + "manager/api/media/folder/save" + (self.typeFilter ? "?filter=" + self.typeFilter : ""), {
                        method: "post",
                        headers: piranha.utils.antiForgeryHeaders(),
                        body: JSON.stringify({
                            parentId: self.currentFolderId,
                            name: self.folderName
                        })
                    })
                    .then(function (response) { return response.json(); })
                    .then(function (result) {
                        if (result.status.type === "success")
                        {
                            // Clear input
                            self.folderName = null;

                            self.folders = result.folders;
                            self.items = result.media;
                        }

                        if (result.status !== 400) {
                            // Push status to notification hub
                            piranha.notifications.push(result.status);
                        } else {
                            // Unauthorized request
                            piranha.notifications.unauthorized();
                        }
                    })
                    .catch(function (error) {
                        console.log("error:", error);
                    });
                }
            },
            toggleDir: function () {
                if (this.direction == "asc") this.direction = "desc"
                else this.direction = "asc"

                this.sortItems();

            },
            sortItems: function () {
                const newItems = [...this.items]
                const newFolders = [...this.folders]
                const folderBy = "name"
                if (this.direction == "asc") {
                    newItems.sort((a, b) => a[this.orderBy].localeCompare(b[this.orderBy]))
                    newFolders.sort((a, b) => a[folderBy].localeCompare(b[folderBy]))
                } else {
                    newItems.sort((a, b) => b[this.orderBy].localeCompare(a[this.orderBy]))
                    newFolders.sort((a, b) => b[folderBy].localeCompare(a[folderBy]))
                }

                this.items = newItems;
                this.filteredItems = [...newItems.filter(x => this.filter === "" ? true : x.filename.toLowerCase().includes(this.filter.toLowerCase()))]
                this.filteredFolders = [...newFolders.filter(x => this.filter === "" ? true : x.name.toLowerCase().includes(this.filter.toLowerCase()))]
            },
            filterItems: function () {
                this.filteredItems = [...this.items.filter(x => this.filter === "" ? true : x.filename.toLowerCase().includes(this.filter.toLowerCase()))]
                this.filteredFolders = [...this.folders.filter(x => this.filter === "" ? true : x.name.toLowerCase().includes(this.filter.toLowerCase()))]
            }
        },
        watch: {
            orderBy: function (val) {
                this.sortItems();
                this.filterItems();
            },
            filter: function (val) {
                this.filterItems()
            },
            direction: function (val) {
                this.sortItems();
            },
        },
        mounted: function () {
            var self = this;
            piranha.permissions.load(function () {
                if (piranha.permissions.media.add) {
                    self.dropzone = piranha.dropzone.init("#mediamanagerpicker-upload-container");
                    self.dropzone.on("complete", function (file) {
                        if (file.status === "success") {
                            setTimeout(function () {
                                self.dropzone.removeFile(file);
                            }, 3000)
                        }
                    });
                    self.dropzone.on("queuecomplete", function () {
                        piranha.mediapicker.refresh();
                    });
                }
            });

        }
    });

    $(document).ready(function() {
        $("#mediamanagerpicker").on("shown.bs.modal", function() {
            $("#mediamanagerpickerSearch").trigger("focus");
        });
    });
}, 400)
