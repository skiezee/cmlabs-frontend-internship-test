// File JavaScript Anda
$(document).ready(function () {
    // Cek apakah parameter meal-id ada di URL
    var mealIdParam = getUrlParameter('meal-id');

    if (mealIdParam) {
        // Jika parameter ada, muat detail meal berdasarkan meal-id
        loadMealDetail(mealIdParam);
    } else {
        // Memuat list kategori saat halaman dimuat
        loadCategories();
    }

    // Fungsi untuk memuat list kategori
    function loadCategories() {
        $.ajax({
            url: 'https://www.themealdb.com/api/json/v1/1/categories.php',
            method: 'GET',
            success: function (data) {
                displayCategories(data.categories);
                setupCategorySearch(data.categories);
            },
            error: function (error) {
                console.error('Error fetching categories:', error);
            }
        });
    }
    // Fungsi untuk menampilkan list kategori
    function displayCategories(categories) {
        var categoryList = $('#categoryList');
        categoryList.empty();

        $.each(categories, function (index, category) {
            var categoryCard = `
            <div class="col-md-4">
                <div class="col">
                    <div class="card bg-light text-white mx-auto" onclick="showCategoryDetail('${category.strCategory}')" style="max-width: rem; position: relative; overflow: hidden; border-radius: 20px;">
                        <img src="${category.strCategoryThumb}" class="card-img-top w-100" alt="${category.strCategory}" />
                        <div class="position-absolute top-0 text-light w-100 h-100 rounded" style="background-color: rgba(0, 0, 0, 0.5); height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 15px;">
                          <h5 class="card-title" style="text-align: center;">${category.strCategory}</h5>
                        </div>
                    </div>
                </div>
            </div>
            `;
            categoryList.append(categoryCard);
        });
    }

    // Fungsi untuk menampilkan halaman Category Detail
    window.showCategoryDetail = function (categoryName) {
        // Redirect ke halaman Category Detail dengan parameter category-name
        window.location.href = `category-detail.html?category-name=${categoryName}`;
    };

    function setupCategorySearch(categories) {
        var categorySearchInput = $('#categorySearchInput');
    
        categorySearchInput.on('input', function () {
            console.log('Search input changed');  // Tambahkan log ini
            var searchTerm = $(this).val().toLowerCase();
            var filteredCategories = categories.filter(function (category) {
                return category.strCategory.toLowerCase().includes(searchTerm);
            });
    
            displayCategories(filteredCategories);
        });
    }

    // Memuat data kategori saat halaman Category Detail dimuat
    loadCategoryDetail();

    // Fungsi untuk memuat data kategori dan menampilkan list detail category
    function loadCategoryDetail() {
        // Mendapatkan parameter category-name dari URL
        var categoryName = getUrlParameter('category-name');

        if (categoryName) {
            // Memuat data meal berdasarkan kategori
            $.ajax({
                url: `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`,
                method: 'GET',
                success: function (data) {
                    displayMeals(data.meals);
                    setupCategoryDetailSearch(data.meals);
                },
                error: function (error) {
                    console.error('Error fetching meals by category:', error);
                }
            });
        } else {
            console.error('category tidak ditemukan.');
        }
    }

    // Fungsi untuk menampilkan list deatil category
    function displayMeals(meals) {
        var mealList = $('#mealList');
        mealList.empty();

        $.each(meals, function (index, meal) {
            var mealCard = `
            <div class="col-md-4">
                <div class="col">
                    <div class="card bg-light text-white mx-auto" onclick="showMealDetail('${meal.idMeal}')" style="max-width: rem; position: relative; overflow: hidden; border-radius: 20px;">
                        <img src="${meal.strMealThumb}" class="card-img-top w-100" alt="${meal.strMeal}" />
                        <div class="position-absolute top-0 text-light w-100 h-100 rounded" style="background-color: rgba(0, 0, 0, 0.5); height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 15px;">
                          <h5 class="card-title" style="text-align: center;">${meal.strMeal}</h5>
                        </div>
                    </div>
                </div>
            </div>
            `;
            mealList.append(mealCard);
        });
    }

    // Fungsi untuk memuat detail meal berdasarkan meal-id
    function loadMealDetail(mealId) {
        $.ajax({
            url: `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`,
            method: 'GET',
            success: function (data) {
                displayMealDetail(data.meals[0]);
            },
            error: function (error) {
                console.error('Error fetching meal detail:', error);
            }
        });
    }

    // Fungsi untuk menampilkan detail meal
    function displayMealDetail(meal) {
        // Update judul halaman dengan nama meal
        $('#mealName').text(`Meal Detail: ${meal.strMeal}`);

        var mealDetail = $('#mealDetail');
        mealDetail.empty();

        var mealContent = `
            <div class="col-md-6">
                <img src="${meal.strMealThumb}" class="img-fluid" alt="${meal.strMeal}">
            </div>
            <div class="col-md-6">
                <h3>${meal.strMeal}</h3>
                <p>${meal.strInstructions}</p>
                <h4>Recipe</h4>
                <p>${meal.strInstructions}</p>
            </div>

            
            <h4 class="mt-5 mx-auto">Tutorial</h4>
            <div class="embed-responsive embed-responsive-16by9 mb-5">
                ${getYouTubeEmbed(meal.strYoutube)}
            </div>
          
                
        `;

        mealDetail.append(mealContent);
    }

    // Fungsi untuk menampilkan halaman Meals Detail
    window.showMealDetail = function (mealId) {
        // Redirect ke halaman Meals Detail dengan parameter meal-id
        window.location.href = `meal-detail.html?meal-id=${mealId}`;
    };

    function setupCategoryDetailSearch(meals) {
        var categoryDetailSearchInput = $('#categoryDetailSearchInput');
    
        categoryDetailSearchInput.on('input', function () {
            console.log('Search input changed');  // Tambahkan log ini
            var searchTerm = $(this).val().toLowerCase();
            var filteredCategories = meals.filter(function (meal) {
                return meal.strMeal.toLowerCase().includes(searchTerm);
            });
    
            displayMeals(filteredCategories);
        });
    }

    // Fungsi untuk mendapatkan nilai parameter dari URL
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Fungsi untuk mendapatkan kode embedded YouTube
    function getYouTubeEmbed(youtubeUrl) {
        // Contoh URL YouTube: https://www.youtube.com/watch?v=VIDEO_ID
        var videoId = youtubeUrl.split('v=')[1];
        if (videoId) {
            return `
                <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>
            `;
        } else {
            return 'YouTube video not available.';
        }
    }
});
