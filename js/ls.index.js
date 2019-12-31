var page = page || {};
(function($) {
    $.extend(page, {
        /**
         * 初始化
         */
        init: function() {
            // 初始化 tab 栏
            this.mainTab = this.tab('.ls-tab-container');
            $(".node.node-leaf").click(function() {
                var $this = $(this);
                page.mainTab.add({
                    id: $this.attr("pid"),
                    title: $this.find("span").text(),
                    content: "<iframe frameborder='0' style='height:100%;width:100%;position:absolute;' src='" + $this.data("href") + "'></iframe>"
                })
            });
        },
        /**
         * 侧边栏收缩
         * @param {收缩按钮}} el 
         */
        slide: function(el) {
            var $el = $(".nav-left .operate-item.slider .ls-icon");
            var slider = $(".ls-layout-slider");
            if (slider.hasClass("contracted")) {
                slider.removeClass("contracted");
                $el.removeClass("ls-icon-shrink-right");
            } else {
                slider.addClass("contracted");
                $el.addClass("ls-icon-shrink-right");
            }
        },
        /**
         * 菜单展开
         * @param {菜单} item 
         */
        expand: function(item) {
            var $item = $(item);
            var pid = $item.attr("pid");
            if ($item.children("b").hasClass('fa-angle-left')) {
                $item.next().addClass("expanded");
                $item.children("b").removeClass('fa-angle-left').addClass('fa-angle-down');
            } else {
                $item.parent().children("ul").removeClass("expanded");
                $item.children("b").removeClass('fa-angle-down').addClass('fa-angle-left');
            }
        },
        /**
         * Tab页初始化
         * @param {选择器} selector 
         */
        tab: function(selector) {
            var $tab = $(selector);
            var $title_container = $tab.find(".ls-tab-titles");
            var $tab_contents = $tab.find(".ls-tab-contents");
            var $title = $tab.find(".ls-tab-titles .tab-title");
            // 激活Tab
            var activeTab = function($tabTitle) {
                var tabId = $tabTitle.data("id");
                if ($tabTitle.hasClass("active")) {
                    return;
                }
                $tab.find(".ls-tab-titles .tab-title.active").removeClass("active");
                $tab.find(".ls-tab-contents .tab-content.active").removeClass("active");
                $tabTitle.addClass("active");

                // 位置调整
                var pleft = $tab.offset().left + 39;
                var pright = $tab.offset().left + $tab.width() - 80;
                var cleft = $tabTitle.offset().left;
                var cright = cleft + $tabTitle.width() + 30;
                var cmgLeft = parseFloat($tabTitle.parent().css("margin-left").replace("px", ""));

                if (cleft < pleft) {
                    cmgLeft = (cmgLeft + pleft - cleft);
                    $tabTitle.parent().css("margin-left", cmgLeft + "px");
                } else if (cright > pright) {
                    cmgLeft = (cmgLeft + pright - cright);
                    $tabTitle.parent().css("margin-left", cmgLeft + "px");
                }
                $tab_contents.find(".tab-content[data-for='" + tabId + "']").addClass('active');
            };
            // 移除Tab
            var removeTab = function($tabTitle) {
                var tabId = $tabTitle.data("id");
                if ($tabTitle.hasClass("active")) {
                    //debugger
                    // 切换到临近的Tab
                    if ($tabTitle.next().length) {
                        activeTab($tabTitle.next());
                    } else if ($tabTitle.prev().length) {
                        activeTab($tabTitle.prev());
                    }
                }
                $tabTitle.remove();
                $tab_contents.find(".tab-content[data-for='" + tabId + "']").remove();
            };
            /**
             * 翻页
             * @param {页码}} pageIndex 
             */
            var changePage = function(diff) {
                // 容器宽度
                var cWidth = $('.ls-tab-container').width() - 119;
                var $firstTitle = $('.ls-tab-titles .tab-title:first'),
                    $lastTitle = $('.ls-tab-titles .tab-title:last');
                // 内容宽度
                var tsWidth = $lastTitle.offset().left -
                    $firstTitle.offset().left +
                    $lastTitle.width() + 30;
                var curPage = $title_container.attr("cur-p");

                // 容器 margin-left 用于计算当前页码
                var cmgLeft = parseFloat($title_container.css("margin-left").replace("px", ""));
                curPage = Math.floor(Math.abs(cmgLeft) / cWidth) + 1;

                var totalPage = Math.floor(tsWidth / cWidth) + (tsWidth % cWidth > 0 ? 1 : 0);
                curPage = curPage + diff;
                if (curPage >= totalPage) {
                    curPage = totalPage;
                    $title_container
                        .css("margin-left", (1 - totalPage) * cWidth + "px")
                        .attr("cur-p", totalPage);
                } else if (curPage <= 1) {
                    curPage = 1;
                    $title_container
                        .css("margin-left", "0px")
                        .attr("cur-p", "1");
                } else {
                    $title_container
                        .css("margin-left", (1 - curPage) * cWidth + "px")
                        .attr("cur-p", curPage);
                }
            }

            //tab 对象
            var tab = {
                /**
                 * 激活
                 * @param {tabId} selector 
                 */
                active: function(id) {
                    activeTab($title_container.find(".tab-title[data-id='" + id + "']"));
                },
                /**
                 * 添加
                 * @param {tabObj} selector 
                 */
                add: function(tabObj) {
                    // tabObj
                    var defaults = {
                        id: 0,
                        title: "tab",
                        content: "",
                        closable: true
                    };
                    tabObj = tabObj || {};
                    tabObj = $.extend(defaults, tabObj);
                    var $newTabTitle = $title_container.find(".tab-title[data-id='" + tabObj.id + "']");
                    if ($newTabTitle.length) {
                        activeTab($newTabTitle);
                        return;
                    }
                    // 无内容，创建内容区域
                    if (!$tab_contents.length) {
                        $tab_contents = $("<div class='ls-tab-contents'></div>");
                        $tab.append($tab_contents);
                    }
                    $tab_contents.append("<div class='tab-content' closeable='" + tabObj.closable + "' data-for='" + tabObj.id + "'>" + tabObj.content + "</div>");
                    $newTabTitle =
                        $("<div class='tab-title' data-id='" + tabObj.id + "'><span class='title'>" + tabObj.title + "</span></span></div>")
                        .click(function() {
                            activeTab($(this));
                        });
                    if (tabObj.closable) {
                        $newTabTitle.attr("closeable", "true").append(
                            $("<i class='ls-icon ls-icon-close op-close'></i>")
                            .click(function() {
                                removeTab($(this).parent());
                            }));
                    };
                    $title_container.append($newTabTitle);
                    activeTab($newTabTitle);

                },
                /**
                 * 移除
                 * @param {tabId} selector 
                 */
                remove: function(id) {
                    removeTab($title_container.find(".tab-title[data-id='" + id + "']"));
                },
                /**
                 * 刷新
                 */
                refresh: function() {
                    var $cur_content = $tab.find(".ls-tab-contents .tab-content.active");
                    var iframe = $cur_content.find("iframe");
                    if (iframe.length) {
                        iframe[0].src = iframe[0].src;
                    }
                },
                /**
                 * 全部关闭
                 */
                closeAll: function() {
                    console.log('关闭所有');
                    $tab.find(".ls-tab-titles .tab-title[closeable='true']").remove();
                    $tab.find(".ls-tab-contents .tab-content[closeable='true']").remove();
                    activeTab($tab.find(".ls-tab-titles .tab-title"));
                },
                /**
                 * 关闭其它
                 */
                closeOthers: function() {
                    console.log('关闭其它');
                    $tab.find(".ls-tab-titles .tab-title:not(.active)[closeable='true']").remove();
                    $tab.find(".ls-tab-contents .tab-content:not(.active)[closeable='true']").remove();
                    activeTab($tab.find(".ls-tab-titles .tab-title.active"));
                },
                /**
                 * 下一页
                 */
                nextPage: function() {
                    changePage(1);
                },
                /**
                 * 上一页
                 */
                prePage: function() {
                    changePage(-1);
                }
            };

            //事件绑定 + 

            //点击切换
            $title.click(function() {
                activeTab($(this));
            });
            //点击关闭
            $title.find(".op-close").click(function() {
                removeTab($(this).parent());
            });
            //操作
            $tab.find(".opt").click(function() {
                tab[$(this).data("opt")]();
            });
            // 左滑
            $tab.find(".opt-left").click(function() {
                // debugger
                tab.prePage();
            });
            // 右滑
            $tab.find(".opt-right").click(function() {
                tab.nextPage();
            });
            return tab;
        }
    });
    page.init();
})(jQuery)