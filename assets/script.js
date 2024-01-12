document.addEventListener("DOMContentLoaded", () => {
     const gallery = document.querySelector(".gallery")
     myGallery(gallery, {
       columns: {
         xs: 1,
         sm: 2,
         md: 3,
         lg: 3,
         xl: 3,
       },
       lightBox: true,
       lightboxId: "myAwesomeLightbox",
       showTags: true,
       tagsPosition: "top",
     })
   })
   
   function myGallery(gallery, options) {
     const defaults = {
       columns: 3,
       lightBox: true,
       lightboxId: null,
       showTags: true,
       tagsPosition: "top",
       navigation: true,
     }
     options = Object.assign({}, defaults, options)
   
     const tagsCollection = []
   
     createRowWrapper(gallery)
   
     if (options.lightBox) {
       createLightBox(gallery, options.lightboxId, options.navigation)
     }
   
     gallery.querySelectorAll(".gallery-item").forEach((item) => {
       responsiveImageItem(item)
       moveItemInRowWrapper(item)
       wrapItemInColumn(item, options.columns)
   
       const theTag = item.dataset.galleryTag
       if (
         options.showTags &&
         theTag !== undefined &&
         tagsCollection.indexOf(theTag) === -1
       ) {
         tagsCollection.push(theTag)
       }
     })
   
     if (options.showTags) {
       showItemTags(gallery, options.tagsPosition, tagsCollection)
     }
   
     gallery.style.display = "block"
   
     listeners(gallery)
   }
   
   function createRowWrapper(gallery) {
     if (!gallery.querySelector(".row")) {
       const rowWrapper = document.createElement("div")
       rowWrapper.classList.add("gallery-items-row", "row")
       gallery.appendChild(rowWrapper)
     }
   }
   
   function responsiveImageItem(item) {
     if (item.tagName === "IMG") {
       item.classList.add("img-fluid")
     }
   }
   
   function moveItemInRowWrapper(item) {
     const rowWrapper = item
       .closest(".gallery")
       .querySelector(".gallery-items-row")
     rowWrapper.appendChild(item)
   }
   
   function wrapItemInColumn(item, columns) {
     const columnClasses = getColumnsClass(columns)
     const columnWrapper = document.createElement("div")
     columnWrapper.classList.add("item-column", "mb-4", ...columnClasses)
     item.parentNode.appendChild(columnWrapper)
     columnWrapper.appendChild(item)
   }
   
   function getColumnsClass(columns) {
     if (typeof columns === "number") {
       return [`col-${Math.ceil(12 / columns)}`]
     } else if (typeof columns === "object") {
       const columnClasses = []
       for (const breakpoint in columns) {
         columnClasses.push(
           `col-${breakpoint}-${Math.ceil(12 / columns[breakpoint])}`
         )
       }
       return columnClasses
     } else {
       console.error(
         `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
       )
       return []
     }
   }
   
   function createLightBox(gallery, lightboxId, navigation) {
     const galleryId = lightboxId ? lightboxId : "galleryLightbox"
   
     let idLightbox = document.getElementById(galleryId)
     if (!idLightbox) {
       gallery.insertAdjacentHTML(
         "beforeend",
         `<div class="modal fade" id="${galleryId}" tabindex="-1" role="dialog" aria-hidden="true">
           <div class="modal-dialog" role="document">
             <div class="modal-content">
               <div class="modal-body">
                 ${
                   navigation
                     ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                     : '<span style="display:none;" />'
                 }
                 <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clique"/>
                 ${
                   navigation
                     ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;">></div>'
                     : '<span style="display:none;" />'
                 }
               </div>
             </div>
           </div>
         </div>`
       )
       idLightbox = document.getElementById(galleryId)
     }
   
     gallery.querySelectorAll(".gallery-item").forEach((item) => {
       item.addEventListener("click", () => {
         document.body.classList.add("modal-open")
   
         const imageSrc =
           item.tagName === "IMG" ? item.src : item.querySelector("img").src
         const lightboxImage = idLightbox.querySelector(".lightboxImage")
         lightboxImage.src = imageSrc
         idLightbox.style.display = "block"
       })
     })
   
     const lightbox = document.getElementById(lightboxId)
   
     idLightbox.addEventListener("click", (e) => {
       if (e.target.classList.contains("modal")) {
         lightbox.style.display = "none"
         document.body.classList.remove("modal-open")
       }
     })
   }
   
   let activeTag = "all"
   
   function prevImage() {
     const activeImage = document.querySelector(".lightboxImage")
     const activeTags = document.querySelectorAll(".active.active-tag")
     let imagesCollection = []
   
     activeTags.forEach((tag) => {
       if (tag.classList.contains("active-tag")) {
         activeTag = tag.dataset.imagesToggle
       }
     })
   
     if (activeTag === "all") {
       document.querySelectorAll(".item-column img").forEach((img) => {
         imagesCollection.push(img)
       })
     } else {
       document.querySelectorAll(".item-column img").forEach((img) => {
         if (img.dataset.galleryTag === activeTag) {
           imagesCollection.push(img)
         }
       })
     }
   
     let index = 0
     imagesCollection.forEach((img, i) => {
       if (activeImage.src === img.src) {
         index = i - 1
       }
     })
   
     const prev =
       imagesCollection[index] || imagesCollection[imagesCollection.length - 1]
     activeImage.src = prev.src
   }
   
   function nextImage() {
     const activeImage = document.querySelector(".lightboxImage")
     const activeTags = document.querySelectorAll(".active.active-tag")
     let imagesCollection = []
   
     activeTags.forEach((tag) => {
       if (tag.classList.contains("active-tag")) {
         activeTag = tag.dataset.imagesToggle
       }
     })
   
     if (activeTag === "all") {
       document.querySelectorAll(".item-column img").forEach((img) => {
         imagesCollection.push(img)
       })
     } else {
       document.querySelectorAll(".item-column img").forEach((img) => {
         if (img.dataset.galleryTag === activeTag) {
           imagesCollection.push(img)
         }
       })
     }
   
     let index = 0
     imagesCollection.forEach((img, i) => {
       if (activeImage.src === img.src) {
         index = i + 1
       }
     })
   
     const next = imagesCollection[index] || imagesCollection[0]
     activeImage.src = next.src
   }
   
   function showItemTags(gallery, position, tags) {
     let tagItems =
       '<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>'
     tags.forEach((value) => {
       tagItems += `<li class="nav-item active">
                   <span class="nav-link"  data-images-toggle="${value}">${value}</span></li>`
     })
     const tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`
   
     if (position === "top") {
       gallery.insertAdjacentHTML("afterbegin", tagsRow)
     } else {
       console.error(`Unknown tags position: ${position}`)
     }
   }
   
   function filterByTag(target) {
     if (target.classList.contains("active-tag")) {
       return
     }
     const activeTags = document.querySelectorAll(".active.active-tag")
     activeTags.forEach((tag) => tag.classList.remove("active", "active-tag"))
     target.classList.add("active", "active-tag")
   
     const tag = target.dataset.imagesToggle
     const galleryItems = document.querySelectorAll(".gallery-item")
     galleryItems.forEach((item) => {
       const parentItemColumn = item.closest(".item-column")
       if (tag === "all" || item.dataset.galleryTag === tag) {
         parentItemColumn.style.display = "block"
       } else {
         parentItemColumn.style.display = "none"
       }
     })
   }
   
   function galleryAnimation(gallery) {
     let galleryItemsRow = gallery.querySelector(".gallery-items-row")
     galleryItemsRow.classList.add("gallery-animation")
     setTimeout(() => {
       galleryItemsRow.classList.remove("gallery-animation")
     }, 300)
   }
   
   function listeners(gallery) {
     gallery.addEventListener("click", (e) => {
       const target = e.target
       if (target.classList.contains("nav-link")) {
         galleryAnimation(gallery)
         filterByTag(target)
       }
       if (target.classList.contains("mg-prev")) {
         prevImage()
       }
       if (target.classList.contains("mg-next")) {
         nextImage()
       }
     })
   }
   