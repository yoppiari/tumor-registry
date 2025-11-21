# Development Guidelines - INAMSOS Project

## 🚨 CRITICAL: File Ownership Policy

### **MANDATORY REQUIREMENT**
All files and directories MUST be created with `yopi:yopi` ownership, NEVER as `root:root`

---

## **File Ownership Rules**

### ✅ **DO (Correct Approach)**
```bash
# Verify current user
whoami  # Should return: yopi

# Create files normally
touch new-file.txt
mkdir new-directory

# Install packages without sudo
npm install

# Check ownership
ls -la
```

### ❌ **DON'T (Wrong Approach)**
```bash
# NEVER create files as root
sudo touch config.json
sudo mkdir /some/path
sudo npm install
sudo docker build
```

---

## **Problem Detection & Resolution**

### **Identify Ownership Issues**
```bash
# Check if files owned by root
find . -user root -ls

# Check specific directory
ls -la /path/to/directory
```

### **Fix Ownership Issues**
```bash
# Change ownership recursively
chown -R yopi:yopi /path/to/files

# Fix all root-owned files in project
find . -user root -exec chown yopi:yopi {} \;
```

---

## **Common Scenarios to Avoid**

1. **Package Installation**
   - ❌ `sudo npm install`
   - ✅ `npm install`

2. **File Creation**
   - ❌ `sudo touch config.json`
   - ✅ `touch config.json`

3. **Directory Creation**
   - ❌ `sudo mkdir logs`
   - ✅ `mkdir logs`

4. **Build Operations**
   - ❌ `sudo npm run build`
   - ✅ `npm run build`

---

## **Pre-flight Checklist**

Before running any command that creates files:

1. [ ] Verify current user: `whoami` (must be `yopi`)
2. [ ] Check target directory ownership: `ls -la`
3. [ ] Avoid `sudo` unless absolutely necessary
4. [ ] If `sudo` is used, immediately fix ownership afterward

---

## **Consequences of Violation**

**Root ownership issues cause:**
- ❌ Permission denied errors during development
- ❌ Build process failures
- ❌ Node module access issues
- ❌ Docker container permission problems
- ❌ Deployment failures

**Impact:**
- Development workflow interruption
- Additional time spent fixing permissions
- Potential security vulnerabilities
- Deployment complications

---

## **Recovery Commands**

```bash
# Complete project ownership fix
sudo chown -R yopi:yopi /home/yopi/Projects/tumor-registry/

# Verify fix
find . -user root | wc -l  # Should return 0
```

---

**Last Updated**: 2025-11-19
**Project**: INAMSOS Cancer Registry System
**Policy**: All files must be owned by `yopi:yopi` user