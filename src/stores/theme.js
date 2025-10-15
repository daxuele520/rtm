import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 当前主题
  const currentTheme = ref('light')
  
  // 主题配置
  const themes = {
    light: {
      name: '浅色主题',
      icon: 'Sunny',
      sidebar: {
        background: '#f0f2f5',
        border: '#d9d9d9',
        logo: {
          background: '#ffffff',
          color: '#1890ff',
          border: '#d9d9d9'
        },
        menu: {
          item: {
            color: '#262626',
            hoverBackground: '#e6f7ff',
            hoverColor: '#1890ff',
            activeBackground: '#1890ff',
            activeColor: '#ffffff'
          },
          submenu: {
            background: '#fafafa',
            item: {
              color: '#595959',
              hoverBackground: '#e6f7ff',
              hoverColor: '#1890ff',
              activeBackground: '#1890ff',
              activeColor: '#ffffff'
            }
          }
        }
      }
    },
    dark: {
      name: '深色主题',
      icon: 'Moon',
      sidebar: {
        background: '#001529',
        border: '#002140',
        logo: {
          background: '#002140',
          color: '#ffffff',
          border: '#002140'
        },
        menu: {
          item: {
            color: '#ffffff',
            hoverBackground: '#1890ff',
            hoverColor: '#ffffff',
            activeBackground: '#1890ff',
            activeColor: '#ffffff'
          },
          submenu: {
            background: '#000c17',
            item: {
              color: '#ffffff',
              hoverBackground: '#1890ff',
              hoverColor: '#ffffff',
              activeBackground: '#1890ff',
              activeColor: '#ffffff'
            }
          }
        }
      }
    },
    blue: {
      name: '蓝色主题',
      icon: 'Cloudy',
      sidebar: {
        background: '#1e3a8a',
        border: '#1e40af',
        logo: {
          background: '#1e40af',
          color: '#ffffff',
          border: '#1e40af'
        },
        menu: {
          item: {
            color: '#e0e7ff',
            hoverBackground: '#3b82f6',
            hoverColor: '#ffffff',
            activeBackground: '#3b82f6',
            activeColor: '#ffffff'
          },
          submenu: {
            background: '#1e40af',
            item: {
              color: '#c7d2fe',
              hoverBackground: '#3b82f6',
              hoverColor: '#ffffff',
              activeBackground: '#3b82f6',
              activeColor: '#ffffff'
            }
          }
        }
      }
    },
    green: {
      name: '绿色主题',
      icon: 'Leaf',
      sidebar: {
        background: '#064e3b',
        border: '#065f46',
        logo: {
          background: '#065f46',
          color: '#ffffff',
          border: '#065f46'
        },
        menu: {
          item: {
            color: '#d1fae5',
            hoverBackground: '#10b981',
            hoverColor: '#ffffff',
            activeBackground: '#10b981',
            activeColor: '#ffffff'
          },
          submenu: {
            background: '#065f46',
            item: {
              color: '#a7f3d0',
              hoverBackground: '#10b981',
              hoverColor: '#ffffff',
              activeBackground: '#10b981',
              activeColor: '#ffffff'
            }
          }
        }
      }
    },
    purple: {
      name: '紫色主题',
      icon: 'Star',
      sidebar: {
        background: '#581c87',
        border: '#6b21a8',
        logo: {
          background: '#6b21a8',
          color: '#ffffff',
          border: '#6b21a8'
        },
        menu: {
          item: {
            color: '#e9d5ff',
            hoverBackground: '#8b5cf6',
            hoverColor: '#ffffff',
            activeBackground: '#8b5cf6',
            activeColor: '#ffffff'
          },
          submenu: {
            background: '#6b21a8',
            item: {
              color: '#c4b5fd',
              hoverBackground: '#8b5cf6',
              hoverColor: '#ffffff',
              activeBackground: '#8b5cf6',
              activeColor: '#ffffff'
            }
          }
        }
      }
    }
  }
  
  // 计算属性
  const currentThemeConfig = computed(() => themes[currentTheme.value])
  const themeList = computed(() => Object.keys(themes).map(key => ({
    key,
    name: themes[key].name,
    icon: themes[key].icon
  })))
  
  // 切换主题
  const setTheme = (themeName) => {
    if (themes[themeName]) {
      currentTheme.value = themeName
      applyTheme(themes[themeName])
      // 保存到本地存储
      localStorage.setItem('theme', themeName)
    }
  }
  
  // 应用主题
  const applyTheme = (theme) => {
    const root = document.documentElement
    const sidebar = theme.sidebar
    
    // 设置CSS变量
    root.style.setProperty('--sidebar-bg', sidebar.background)
    root.style.setProperty('--sidebar-border', sidebar.border)
    root.style.setProperty('--logo-bg', sidebar.logo.background)
    root.style.setProperty('--logo-color', sidebar.logo.color)
    root.style.setProperty('--logo-border', sidebar.logo.border)
    root.style.setProperty('--menu-item-color', sidebar.menu.item.color)
    root.style.setProperty('--menu-item-hover-bg', sidebar.menu.item.hoverBackground)
    root.style.setProperty('--menu-item-hover-color', sidebar.menu.item.hoverColor)
    root.style.setProperty('--menu-item-active-bg', sidebar.menu.item.activeBackground)
    root.style.setProperty('--menu-item-active-color', sidebar.menu.item.activeColor)
    root.style.setProperty('--submenu-bg', sidebar.menu.submenu.background)
    root.style.setProperty('--submenu-item-color', sidebar.menu.submenu.item.color)
    root.style.setProperty('--submenu-item-hover-bg', sidebar.menu.submenu.item.hoverBackground)
    root.style.setProperty('--submenu-item-hover-color', sidebar.menu.submenu.item.hoverColor)
    root.style.setProperty('--submenu-item-active-bg', sidebar.menu.submenu.item.activeBackground)
    root.style.setProperty('--submenu-item-active-color', sidebar.menu.submenu.item.activeColor)
  }
  
  // 初始化主题
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme && themes[savedTheme]) {
      currentTheme.value = savedTheme
    }
    applyTheme(currentThemeConfig.value)
  }
  
  return {
    currentTheme,
    currentThemeConfig,
    themeList,
    themes,
    setTheme,
    initTheme
  }
})
